export class JiraUtil {
  static generateMarkdown = (response: any, jiraOrgName: string): string => {
    const data: any[] = JiraUtil.extractRelevantData(response, jiraOrgName);
    const markdown = data.reduce((acc, issue) => {
      return `${acc}\n- [${issue.key}](${issue.url}) \`${issue.status}\` -> ${issue.title} `;
    }, '');

    return markdown;
  };
  private static extractRelevantData = (response: any, jiraOrgName: string) =>
    (response?.issues ?? []).map((issue: any) => {
      return {
        key: issue.key,
        url: `https://${jiraOrgName}.atlassian.net/browse/${issue.key}`,
        title: issue.fields.summary,
        priority: issue.fields.priority.name,
        status: issue.fields.status.name,
      };
    });
}
