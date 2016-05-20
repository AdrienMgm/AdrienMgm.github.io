function isMobile(){
	/* Is mobile ? */
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    return isMobile;
}

function loadProjects(){
	// load Projets
	var dfd = $.Deferred();

	$.ajax({
		url: "projects/projects.json",
		dataType: 'json',
		success: function(data) {
			$("#projects").empty();
			$(".load").hide();
	        $.each(data.projects, function(key, element){
	        	//console.log(element);
	        	var project = '<div id="'+key+'" class="project ';
	        	$.each(element.categorie, function(i, categ){
	        		project += categ+' '; 
	        	});
	        	project += element.size+'" style="background-image: url('+element.images[0]+');">';
				project += '<a class="info" name="'+element.name+'" href="#/project/'+key+'">';
				project += '<h2>'+element.name+'</h2>';
				// project += '<div class="littleDesc">'+element.desc+'</div>';
				// project += '<ul class="tags">';
				// $.each(element.tags, function(i, tag){
				// 	project += '<li class="tag">'+tag+'</li>';
				// });
				// project += '</ul>';
				// project += '<span class="more">Click to see more</span>';
				project += '</a>';
				// project += '<img src="'+element.images[0]+'" alt="'+element.categorie+' '+element.name+'" />';
				project += '</div>';
	    		$("#projects").prepend(project);
	        });

	        dfd.resolve(data);
	    },
		error: function(request, textStatus, errorThrown) {
			dfd.reject(textStatus + ' : ' + errorThrown);
		}
	});

	return dfd.promise();
}

function routesHTML5(data){
	// Verifications
	var hash = window.location.hash;
	if(hash.indexOf("#/project/") > -1) {
		displayProject(hash.substr(10), data);
	}
	else {
		window.location.hash = '/home';
	}
	lastHash = hash;

	if ("onhashchange" in window) { // event supported?
	    window.onhashchange = function () {
	    	// Verifications
			var hash = window.location.hash;
			if(hash.indexOf("#/project") > -1) {
				displayProject(hash.substr(10), data);
			}
			else {
				displayHome();
			}
			lastHash = hash;
	    }
	}
	else { // event not supported:
	    var storedHash = window.location.hash;
	    window.setInterval(function () {
	        if (window.location.hash != storedHash) {
	            storedHash = window.location.hash;
	            // Verifications
				var hash = window.location.hash;
				if(hash.indexOf("#/project") > -1) {
					displayProject(hash.substr(10), data);
				}
				else {
					displayHome();
				}
				lastHash = hash;
	        }
	    }, 100);
	}
}

function displayHome() {
	if(!$("#content #home").length) {
		var lastIdProject = lastHash.replace('#/project/', '#');
		$("#content").empty().removeClass("content--project");
		$("#main > nav").show();
		$("#content").append(home);

		var el = $(lastIdProject);
		var elOffset = el.offset().top;
		var elHeight = el.height();
		var windowHeight = $(window).height();
		var offset;

		if(elHeight < windowHeight) {
			offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
		}
		else {
			offset = elOffset;
		}
		$(window).scrollTop(offset);
	}
}

function displayProject(hash, data){	
	// Verifications
	var projectName = hash;
	var project = data.projects[projectName];
	if(!project) {
		return;
	}

	// Create Page
	var projContent = '';
	projContent += '<div id="project__'+ projectName +'" class="project">';
		projContent += '<ul id="fullpage">';
			if(project.video){
				projContent += '<li id="project__video">';
				
					projContent += '<div id="video__container">';
					projContent += '<video id="video" autoplay loop id="video-background" muted><source src="'+project.video+'" type="video/mp4"></video>';
					projContent += '</div>';
					
					projContent += '<h1>'+project.name+'</h1>';

					projContent += '<div class="desc">';
						projContent += project.desc;
						projContent += '<ul class="tags">';
						$.each(project.tags, function(i, tag){
							projContent += '<li class="tag">'+tag+'</li>';
						});
						projContent += '</ul>';
					projContent += '</div>';
				
				projContent += '</li>';
			}
			for(var i = 0; i < project.images.length; i++) {
				projContent += '<li id="img_'+ projectName + '_' + i +'" class="prject__image section" style="background-image: url('+ project.images[i] +');">';
				if(i == 0 && !project.video) {
					projContent += '<h1>'+project.name+'</h1>';

					projContent += '<div class="desc">';
					projContent += project.desc;
					projContent += '<ul class="tags">';
					$.each(project.tags, function(i, tag){
						projContent += '<li class="tag">'+tag+'</li>';
					});
					projContent += '</ul>';
				projContent += '</div>';
				}
				projContent += '</li>';
			}
		projContent += '</ul>';

		projContent += '<nav>';
			projContent += '<ul>';
				projContent += '<li>';
					projContent += '<a class="exit">◄</a>';
				projContent += '</li>';
			projContent += '</ul>';
		projContent += '</nav>';
	projContent += '</div>';

	// Display Page & Animate it
	var el = $("#"+projectName);
	var elOffset = el.offset().top;
	var elHeight = el.height();
	var windowHeight = $(window).height();
	var offset;

	if(elHeight < windowHeight) {
		offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
	}
	else {
		offset = elOffset;
	}

	// $('html, body').animate(
	// {
	// 	scrollTop: offset
	// },
	// 2000,
	// "easeOutCubic",
	// function(){
		$(window).scrollTop(offset);
		$("#main > nav").fadeOut("fast");
		$("#content").html(projContent).promise().done(function(){
			$(window).scrollTop(0);
			$("#content").addClass("content--project");
			// Check video size
			var video = document.getElementById('video');
			if(video){
				video.addEventListener('loadedmetadata', function() {
			        video.width = this.videoWidth;
			        video.height = this.videoHeight;

					var windowRatio = window.innerWidth / window.innerHeight;
					var videoRatio = video.width / video.height;

					if(videoRatio > 1) {
						$("video").css("width", "100%");
			        }
			        else {
						$("video").css("height", "100%");
			        }
			        $("#video__container").prepend('<video id="blur-video" autoplay loop id="video-background" muted><source src="'+project.video+'" type="video/mp4"></video>');
				});
			}
			$(".exit").click(function(){
				pushHash("/home");
			});
		});
	// });
}

var home;
var lastHash;

function pushHash(hash) {
	lastHash = window.location.hash;
	window.location.hash = hash;
}

$(document).ready(function() {
	///////////////////////
	/* Load project.json */
	///////////////////////
	loadProjects().done(function(projects){
		home = $("#content").html();
		////////////////////
		/* routage system */
		////////////////////
		routesHTML5(projects);
	});

	////////////////
	/* Navigation */
	////////////////
	$('nav ul').onePageNav({
		currentClass: 'current',
		filter: ':not(.resume a)',
	    changeHash: false,
	    scrollSpeed: 750,
	    scrollOffset: 50,
	    scrollThreshold: 0.5,
	    easing: 'swing',
	    begin: function() {
	        //I get fired when the animation is starting
	    },
	    end: function() {
	        //I get fired when the animation is ending
	    },
	    scrollChange: function($currentListItem) {
	        //I get fired when you enter a section and I pass the list item of the section
	    }
	});

	/////////////////
	/* Back to top */
	/////////////////
	$(window).scroll(function() {
		if($(window).scrollTop() > 100) {	
			$("#backToTop").fadeIn(250);
		} else {	
			$("#backToTop").fadeOut(250);
		}
	});
	$('#backToTop').click(function(event) {
        $('html, body').animate({scrollTop : 0}, 'slow');
        event.preventDefault();
    });

	//////////////////////////////
	/* Events (Click, hover...) */
	//////////////////////////////
	// $(document).on("click", ".project a.info, .shortcuts", function(event){
	// 	var current = $(this).attr("name");
	// 	$.getJSON("projects/projects.json", function(data) {
	// 		popup = '<div id="projectDetails">';
	//         $.each(data.projects, function(i, element){
	//         	if( element.name == current){
	//         		popup += '<div id="up">';
	// 		        	popup += '<h2>'+element.name+'</h2>';
	// 					popup += '<div class="right">';
	// 						popup += '<p class="desc">'+element.desc+'</p>';
	// 						if(element.online){
	// 							popup += '<a class="online" target="_blank" href="'+element.online+'">See Online</a>';
	// 						}
	// 						popup += '<ul class="tags">';
	// 						$.each(element.tags, function(i, tag){
	// 							popup += '<li class="tag">'+tag+'</li>';
	// 						});
	// 						popup += '</ul>';
	// 					popup += '</div>';
	// 					popup += '<div class="left">';
	// 						popup += '<ul class="bxslider">';
	// 				        	if(element.video){
	// 				        		popup += '<li>';
	// 								popup += '<iframe src="'+element.video+'" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
	// 								popup += '</li>';
	// 							}
	// 							$.each(element.images, function(i, image){
	// 								popup += '<li><img src="'+image+'" alt="" /></li>';
	// 							});
	// 						popup += '</ul>';
	// 					popup += '</div>';
	// 					popup += '<div class="clear"></div>';
	// 				popup += '</div>';
	// 			}
	//         });
	// 		popup += '<div id="down">';
	//         popup += '<p>Projects</p>';
	//         popup += '<ul class="short">';
	//         	$.each(data.projects, function(i, element){
	// 	        	if (element.name != current){
	// 					popup += '<li><a class="shortcuts" name="'+element.name+'" href="#">'+element.name+'</a></li>';
	// 				}
	// 			});
	// 		popup += '</ul>';
	// 		popup += '</div>';
	//         popup += '</div>';
	//     }).done(function() {
	//     	if(windowWidth > 960){
	// 	    	$.colorbox({
	// 	    		width: "80%",
	// 	    		height: "100%",
	// 	    		scalePhotos: true,
	// 	    		fixed: true,
	// 	    		opacity: .8,
	// 	    		close: "+",
	// 	    		html:popup,
	// 	    		onComplete:function(){
	// 					$('.bxslider')
	// 					.bxSlider({
	// 						adaptiveHeight: true,
	// 						video: true,
	// 						useCSS: false,
	// 						onBeforeSlide: function(){
	// 							jQuery('video').each(function(){
	// 								this.pause();
	// 							})
	// 						}
	// 					});
	// 	    		}
	// 	    	});
	//     	}else{
	//     		$.colorbox({
	// 	    		width: "100%",
	// 	    		height: "100%",
	// 	    		scalePhotos: true,
	// 	    		fixed: true,
	// 	    		opacity: .8,
	// 	    		close: "+",
	// 	    		html:popup,
	// 	    		onComplete:function(){
	// 					$('.bxslider').bxSlider({
	// 						adaptiveHeight: true,
	// 						video: true,
	// 						useCSS: false,
	// 						onBeforeSlide: function(){
	// 							jQuery('video').each(function(){
	// 								this.pause();
	// 							})
	// 						}
	// 					});
	// 	    		}
	// 	    	});
	//     	}
	// 	})
	// 	.fail(function() {
	// 		console.log( "error see more project" );
	// 	})
	// 	event.preventDefault();
	// });

	/* Fit text */
	$("#name").fitText(1.2);
	$("#aim").fitText(3);

	$("#Iam").fitText(1.25);
	$("#engineer").fitText(1.29);

	$("#student-at").fitText(1.5);
	$("#imac > h2").fitText(.3);
	$("#engineering-school").fitText(1.5);
	$(".get-resume").fitText(1);

	$("#accolade").fitText(.038);
	$("#web-mobile").fitText(.65);
	$("#videogames").fitText(.7);
	$("#image").fitText(.89);
	$("#management-marketing").fitText(1.44);
	$("#cinema-communication").fitText(1.35);

	// $("#but-also").fitText(2.3);
	// $("#designer").fitText(0.58);
	// $("#developer").fitText(0.78);

	$("#what-can-i-do").fitText(.84);
	$("#for-you").fitText(.47);
	$("#now").fitText(.45);

	$("#learn").fitText(2);
	$("#have-a-look").fitText(1.05);
	$("#my-work").fitText(.4);

	$("#like").fitText(1);

	$("#see").fitText(1.1);
	
	$(".desc").fitText(.9);
});