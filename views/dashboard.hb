<h1>Dashboard<h1>
<h2>User: <h3>{{profile}}</h3></h2>
<h2>Commits:</h2>
{{#each commits}}
             {{#if this.[notRead]}}
                 <h4>Organization: {{this.[organization]}} - Repository: {{this.[repository]}}
                 - Author: {{this.[author]}} - Message: {{this.[message]}} </h4>
             {{/if}}
{{/each}}
<h2>Releases:</h2>
{{#each releases}}
    {{#if this.[notRead]}}
        <h4>Organization: {{this.[organization]}} - Repository: {{this.[repository]}}
        - Author: {{this.[author]}} - Version: {{this.[version]}} - Title: {{this.[title]}} - Message: {{this.[message]}} </h4>
    {{/if}}
{{/each}}
