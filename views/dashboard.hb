<h1>Dashboard<h1>
<h2>User: <h3>{{profile}}</h3></h2>
<h2>Organizations:</h2>
{{#each organizations}}
    <h3>{{this.[login]}}</h3>
{{/each}}
