<h1>Dashboard<h1>
<h2>User: <h3>{{profile}}</h3></h2>
<h2>Organizations:</h2>
{{#each orgs}}
             <h3>{{this.[login]}}</h3>
{{/each}}
<h2>Repos:</h2>
{{#each repos}}
             <h3>{{this}}</h3>
{{/each}}
