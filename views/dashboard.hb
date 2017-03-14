<h1>Dashboard<h1>
<p>User: {{profile}}</p>
<p>Organizations:</p>
{{#each organizations}}
    <p>{{this.[login]}}</p>
{{/each}}
