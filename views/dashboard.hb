<h1>Dashboard<h1>
<h2>User: <h3>{{profile}}</h3></h2>
<h2>Organizations:</h2>
{{#each organizations}}
    <h3>{{this.[login]}}</h3>
    <div class="col-md-4">
        <canvas id="canvasLineChart" class="card"></canvas>
    </div>
    <script src="../js/Chart.min.js"></script>
    <script>
        var canvasLineChart = document.querySelector("#canvasLineChart");
        var lineChart = new Chart(canvasLineChart, {
            type: 'line',
            data: {
                      labels: ["January", "February", "March", "April", "May", "June", "July"],
                      datasets: [
                          {
                              label: "Commits",
                              fill: false,
                              lineTension: 0.1,
                              backgroundColor: "rgba(75,192,192,0.4)",
                              borderColor: "rgba(75,192,192,1)",
                              borderCapStyle: 'butt',
                              borderDash: [],
                              borderDashOffset: 0.0,
                              borderJoinStyle: 'miter',
                              pointBorderColor: "rgba(75,192,192,1)",
                              pointBackgroundColor: "#fff",
                              pointBorderWidth: 1,
                              pointHoverRadius: 5,
                              pointHoverBackgroundColor: "rgba(75,192,192,1)",
                              pointHoverBorderColor: "rgba(220,220,220,1)",
                              pointHoverBorderWidth: 2,
                              pointRadius: 1,
                              pointHitRadius: 10,
                              data: [65, 59, 80, 81, 56, 55, 40],
                              spanGaps: false,
                          }
                      ]
                  },
            options: {
                scales: {
                    xAxes: [{
                        display: false
                }]
                }
            }
        });
    </script>
{{/each}}
