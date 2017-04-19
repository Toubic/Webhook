<!-- Bootstrap Dashboard by Creative Tim  -->
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

	<title>Assignment 2 – Programming assignment</title>

	<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
    <meta name="viewport" content="width=device-width" />


    <!-- Bootstrap core CSS     -->
    <link rel="stylesheet" href="../../css/bootstrap.min.css" />

    <!--  Light Bootstrap Table core CSS    -->
    <link rel="stylesheet" href="../../css/light-bootstrap-dashboard.css"/>

</head>
<body>
    <div class="wrapper">
        <div class="sidebar" data-color="orange">

        <!--
            Tip 1: you can change the color of the sidebar using: data-color="blue | azure | green | orange | red | purple"
        -->

            <div class="sidebar-wrapper">
                <div class="logo">
                    <a href="http://www.creative-tim.com" class="simple-text">
                        Creative Tim
                    </a>
                </div>

                <ul class="nav">
                    <li class="active">
                        <a href="/">
                            <i class="pe-7s-graph"></i>
                            <p>Dashboard</p>
                        </a>
                    </li>
                    <li class="active">
                        <a href="/options">
                            <i class="pe-7s-graph"></i>
                            <p>Options</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="main-panel">

            <nav class="navbar navbar-default navbar-fixed">
                        <div class="container-fluid">
                            <div class="collapse navbar-collapse">

                                <ul class="nav navbar-nav navbar-right">
                                    <li>
                                        <a href="/logout">
                                            Log out
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>


            <div class="content">
                <div class="container-fluid">
                    <div class="row">
                        {{{body}}}
                    </div>
                </div>
            </div>

            <footer class="footer">
                <div class="container-fluid">
                    <p class="copyright pull-right">
                        &copy; 2016 <a href="http://www.creative-tim.com">Creative Tim</a>, made with love for a better web
                    </p>
                </div>
            </footer>

        </div>
    </div>
</body>
</html>