<h1>Dashboard<h1>
<h2>User: <h3>{{profile}}</h3></h2>
<h2>Commits:</h2>
<div id="payload">
</div>
{{#each commits}}
    <h4>Organization: {{this.[organization]}} - Repository: {{this.[repository]}}
    - Author: {{this.[author]}} - Message: {{this.[message]}} </h4>
{{/each}}
