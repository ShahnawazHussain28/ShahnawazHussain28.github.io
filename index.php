<!DOCTYPE html>
<html>
<head>
	<title>Some Cool Stuff</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<style type="text/css">
		@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap');
		*{
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			font-family: 'Poppins', sans-serif;
		}
		html{
			scroll-behavior: smooth;
		}
		body{
			min-height: 1000px;
			background: #000;
		}
		header{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 30px;
			transition: 0.6s;
			z-index: 1000;
		}
		.stickey{
			padding: 5px 50px;
			background: #fff;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		}
		.stickey .logo, .stickey ul li a{
			color: #000;
		}
		header .logo{
			position: relative;
			font-weight: 700;
			color: #fff;
			text-decoration: none;
			font-size: 2em;
			text-transform: uppercase;
			letter-spacing: 2px;
			transition: 0.6s;
		}
		header ul{
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;	
		}
		header ul li{
			position: relative;
			list-style: none;
		}
		header ul li a{
			position: relative;
			margin: 0 10px;
			text-decoration: none;
			color: #fff;
			letter-spacing: 2px;
			font-weight: 300;
			transition: 0.6s;
		}
		.banner{
			position: relative;
			width: 100%;
			min-height: 40vh;
			background-color: #fff;
			/*background: url('background.jpg');*/
			background-size: contain;
			background-repeat: no-repeat;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.banner img{
			width: 100%;

		}
		.banner h2{
			color: #fff;
			font-size: 90px;
			text-transform: uppercase;
			text-align: center;
			position: absolute;
			line-height: 1em;
		}
		.banner h2 span{
			color: #4978ff;
		}
		.sec{
			background: #fff;
			padding: 100px;
			min-height: 10vh;
			display: flex;
			flex-flow: wrap;
			justify-content: center;
			align-items: center;
		}
		.sec .cont{
			position: relative;
			text-align: center;
			width: 100%;
		}
		.mxw800p{
			text-align: center;
			max-width: 800px;
			margin: 0 auto;
		}
		h3{
			font-size: 40px;
			font-weight: 100;
			margin-bottom: 10px;
		}
		p{
			position: relative;
			font-size: 18px;
			font-weight: 300;
			margin-bottom: 20px;
			letter-spacing: 0.7px;
		}
		.services{
			text-align: center;
			position: relative;
			margin: 20px;
			margin-top: 40px;
			cursor: pointer;
		}
		.services .box{
			width: 300px;
			margin: 0 auto;
			background: #fff;
			padding: 20px;
			box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
		}
		.services .box .iconbox{
			height: 60%;
			background-color: lightblue;
			object-fit: cover;
		}
		.services .box .iconbox img {
			width: 100%;
		}
		#contact a{
			color: black;
		}
		#contact a i{
			box-sizing: border-box;
			font-size: 42px;
			margin: 0px 20px;
			padding: 5px;
		}
		.toggle{
			display: none;
		}
		@media (max-width: 720px){
			.toggle{
				display: block;
				position: relative;
				width: 30px;
				height: 30px;
				cursor: pointer;
			}
			.toggle:before{
				content: "";
				position: absolute;
				top: 4px;
				width: 100%;
				height: 2px;
				background: #000;
				z-index: 1;
				box-shadow: 0 10px 0 #000;
				transition: 0.5s;
			}
			.toggle:after{
				content: "";
				position: absolute;
				bottom: 4px;
				width: 100%;
				height: 2px;
				background: #000;
				z-index: 1;
				transition: 0.5s;
			}
			header{
				background: #fff;
			}
			header ul{
				position: absolute;
				top: 50px;
				left: 0;
				width: 100%;
				height: 100vh;
				text-align: center;
				overflow: auto;
				background: #fff;
				visibility: hidden;
				opacity: 0;
			}
			header.active ul{
				visibility: visible;
				opacity: 1;
				display: block;
				padding-top: 20px;
			}
			header.active ul li{
				margin: 20px 0;
				font-size: 20px;

			}
			header .logo, header ul li a{
				color: #000;
			}
			.banner{
				margin-top: 35px;
			}
			.banner h2{
				font-size: 60px;
			}
			.sec{
				padding: 20px 50px 100px 50px;
			}
		}
	</style>
</head>
<body>
	<header id="header">
		<a href="#" class="logo">Logo</a>
		<ul>
			<li><a href="#home" onclick="toggle()">Home</a></li>
			<li><a href="#content" onclick="toggle()">Content</a></li>
			<li><a href="#about" onclick="toggle()">About</a></li>
			<li><a href="#contact" onclick="toggle()">Contact</a></li>
		</ul>
		<div class="toggle" onclick="toggle()"></div>
	</header>
	<!-- Banner -->
	<section class="banner" id="home">
		<img src="thumbnails/background.jpg">
	</section>
	<!-- Content -->
	<section class="sec about" id="content">
		<?php  

// 		foreach ($array_data as $key) {
// 			echo "<div class='services' onclick=\"window.location.href ='" . $key['onclick'] . "' \">";
// 			echo "<div class='box'>";
// 			echo "<div class='iconbox'>";
// 			echo "<img src='" . $key['image'] . "'>";
// 			echo "</div><div class='content'>";
// 			echo "<h2>" . $key['title'] . "</h2>";
// 			echo "<p>" . $key['description'] . "</p>";
// 			echo "</div></div></div>";
// 		}

// 		?>
		<div class='services' onclick="window.location.href ='numbergameai'">
			<div class='box'>
				<div class='iconbox'>
					<img src='thumbnails/ai.jpg'>
					</div><div class='content'>
					<h2>Number Game AI</h2>
					<p>Check Out if a Computer can guess your number!</p>
				</div>
			</div>
		</div>
	</section>
	<!-- About -->
	<section class="sec" id="about">
		<div class="cont">
			<div class="mxw800p">
				<h3>About the Creator</h3>
				<p>Hey there, I'm Shahnawaz Hussain, the creator of this website. This website is entirely developed by me and all the content is created by only myself. I'm a first year student of BTech in Computer Science in the college GCETTS. For any queries you can contact me, details are given in the contact section of this page. Enjoy surfing this website. And remember It's FUN Zone.</p>
			</div>
		</div>
	</section>
	<!-- Contacts -->
	<section class="sec" id="contact">
		<h3>Contacts &nbsp;&nbsp;&nbsp;&nbsp; </h3>
		<a href="https://instagram.com/Shahnawaz.28" target="_blank">
			<i class="fa fa-instagram"></i>
		</a>
		<a href="https://mail.google.com/mail/?view=cm&fs=1&to=filzahussain96@gmail.com" target="_blank">
			<i class="fa fa-envelope"></i>
		</a>
	</section>

<script>
	window.addEventListener("scroll", function(){
		var header = document.querySelector("header");
		header.classList.toggle("stickey", window.scrollY > 0);
	})
	function toggle() {
		var header = document.querySelector("header");
		header.classList.toggle("active");
	}
</script>
</body>
</html>
