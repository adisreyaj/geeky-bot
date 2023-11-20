import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { JiraUtil } from './util/jira.util';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="flex flex-col gap-4 h-screen p-6">
      <header>
        <div class="flex flex-col gap-2">
          <label for="jira-url">JIRA Org Name</label>
          <div class="flex items-center gap-4">
            <input
              class="input input-bordered w-full max-w-xs"
              type="text"
              id="jira-url"
              [ngModel]="this.jiraOrgName()"
              (ngModelChange)="this.jiraOrgName.set($event)"
            />
            <button class="btn btn-primary" (click)="this.setJIRAUrl()">
              Set URL
            </button>
            <a
              class="btn "
              target="_blank"
              rel="noopener noreferrer"
              [href]="this.jiraStatusUrl()"
            >
              Open Jira
            </a>
          </div>
        </div>
      </header>
      <div class="grid grid-cols-2 gap-4 flex-auto">
        <div class="flex flex-col gap-2">
          <label for="jira-response">JIRA Response</label>
          <textarea
            id="jira-response"
            class="textarea textarea-bordered h-full"
            [ngModel]="this.jiraResponse()"
            (ngModelChange)="this.updateResponse($event)"
          ></textarea>
        </div>

        <div class="flex flex-col gap-2 w-full relative">
          <button
            class="absolute top-12 right-4 btn btn-primary text-white"
            [cdkCopyToClipboard]="this.status()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 4V8H18V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H6ZM8 2H16V6H8V2Z"
              ></path>
            </svg>
          </button>
          <label for="status">Output</label>
          <textarea
            id="status"
            class="textarea textarea-bordered h-full w-full"
            [value]="this.status()"
          ></textarea>
        </div>
      </div>
    </div>
  `,

  imports: [FormsModule, ClipboardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  jiraResponse = signal('Paste Jira Response');
  jiraOrgName = signal('<org>');

  status = computed(() => {
    try {
      const parsedResponse = JSON.parse(this.jiraResponse());

      return JiraUtil.generateMarkdown(parsedResponse, this.jiraOrgName());
    } catch (error) {
      return 'JIRA Response: Invalid JSON';
    }
  });

  #JIRA_URL_KEY = 'geeky-bot-jira-url';

  #JQL = `updated >= -1d AND assignee in (currentUser()) AND status in ("In Progress", "In Review", Resolved) order by created DESC`;

  jiraStatusUrl = computed(() => {
    const url = new URL(
      `https://${this.jiraOrgName()}.atlassian.net/rest/api/2/search`
    );
    url.searchParams.set('jql', this.#JQL);
    return url;
  });

  ngOnInit() {
    const jirOrgNameSaved = localStorage.getItem(this.#JIRA_URL_KEY);

    if (jirOrgNameSaved) {
      this.jiraOrgName.set(jirOrgNameSaved);
    }
  }

  updateResponse(value: string) {
    try {
      const parsedResponse = JSON.parse(value);
      this.jiraResponse.set(JSON.stringify(JSON.parse(value), null, 2));
    } catch (error) {
      throw new Error('JIRA Response: Invalid JSON');
    }
  }

  setJIRAUrl() {
    localStorage.setItem(this.#JIRA_URL_KEY, this.jiraOrgName());
  }
}
