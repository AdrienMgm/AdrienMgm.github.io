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
	$.ajax({
		url: "projects/projects.json",
		dataType: 'json',
		success: function(data) {
			$("#projects").empty();
	        $.each(data.projects.reverse(), function(i, element){
	        	//console.log(element);
	        	var project = '<div id="project_'+element.id+'" class="project ';
	        	$.each(element.categorie, function(i, categ){
	        		project += categ+' '; 
	        	});
	        	project += element.size+'">';
				project += '<a class="info" name="'+element.name+'" href="#">';
				project += '<h2>'+element.name+'</h2>';
				project += '<div class="littleDesc">'+element.desc+'</div>';
				project += '<ul class="tags">';
				$.each(element.tags, function(i, tag){
					project += '<li class="tag">'+tag+'</li>';
				});
				project += '</ul>';
				project += '<span class="more">Click to see more</span>';
				project += '</a>';
				project += '<img src="'+element.images[0]+'" alt="'+element.categorie+' '+element.name+'" />';
				project += '</div>';
	    		$("#projects").isotope('insert', $(project));
	        });
	        $("#projects").isotope('reLayout');
	    },
		error: function(request, textStatus, errorThrown) {
			alert(textStatus);
		},
		complete: function(request, textStatus) {
			$("#projects").isotope('reLayout');
		}
	});
}

$(window).load(function(){
	$(".load").hide();
	$("#projects").isotope('reLayout');
})

$(document).ready(function() {
	//////////////////////////
	/* Masonry/Isotope grid */
	//////////////////////////
	$("#projects").isotope({
		itemSelector : '.project',
		resizable: false, // disable normal resizing
		// set columnWidth to a percentage of container width
		masonry: {
			columnWidth: $("#projects").width() / 6
		}
	});
	// Recalculate on resize
	$(window).smartresize(function(){
	  $("#projects").isotope('reLayout');
	});

	$('#filter .tag').on('click', function() {
		$('#filter .tag').removeClass('active');
		$(this).addClass('active');

		var id = $(this).attr('id');
		if(id == 'all') id = 'project';
		$('#projects').isotope({ filter: '.'+id });
	});

	///////////////////////
	/* Load project.json */
	///////////////////////
	loadProjects();
	$("#projects").isotope('reLayout');
	
	var windowWidth = $(window).width();
	var windowHeight= $(window).height();

	/////////////
	/* General */
	/////////////

	// if(windowWidth <= 600-22) 	$('#work #projects .project').css('height', 0.9*$('#content').width());
	// else 						$('#work #projects .project').css('height', 0.3*$('#content').width());

	// // /* Resize */
	// $(window).resize(function() {
	// 	var windowWidth = $(window).width();
	//   	if(windowWidth <= 600-22)	$('#work #projects .project').css('height', 0.9*$('#content').width());
	// 	else						$('#work #projects .project').css('height', 0.3*$('#content').width());
	// });

	//////////////
	/* ColorBox */
	//////////////

	//Configure colorbox call back to resize with custom dimensions
	$.colorbox.settings.onLoad = function() {
		colorboxResize();
	}
	//Customize colorbox dimensions
	var colorboxResize = function(resize) {
		var width;
		(windowWidth > 960) ? width = "80%" : width = "100%";
		var height = "100%";
		$.colorbox.settings.height = height;
		$.colorbox.settings.width = width;
		//if window is resized while lightbox open
		if(resize) {
			$.colorbox.resize({
				'height': height,
				'width': width
			});
		}
	}
	//In case of window being resized
	$(window).resize(function() {
		colorboxResize(true);
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
	$(document).on("mouseenter", ".info", function(){
		$(this).find('.littleDesc').dotdotdot({
			watch: "window"
		});
	});

	$(document).on("click", ".project a.info, .shortcuts", function(event){
		var current = $(this).attr("name");
		$.getJSON("projects/projects.json", function(data) {
			popup = '<div id="projectDetails">';
	        $.each(data.projects, function(i, element){
	        	if( element.name == current){
	        		popup += '<div id="up">';
			        	popup += '<h2>'+element.name+'</h2>';
						popup += '<div class="right">';
							popup += '<p class="desc">'+element.desc+'</p>';
							if(element.online){
								popup += '<a class="online" target="_blank" href="'+element.online+'">See Online</a>';
							}
							popup += '<ul class="tags">';
							$.each(element.tags, function(i, tag){
								popup += '<li class="tag">'+tag+'</li>';
							});
							popup += '</ul>';
						popup += '</div>';
						popup += '<div class="left">';
							popup += '<ul class="bxslider">';
					        	if(element.video){
					        		popup += '<li>';
									popup += '<iframe src="'+element.video+'" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
									popup += '</li>';
								}
								$.each(element.images, function(i, image){
									popup += '<li><img src="'+image+'" alt="" /></li>';
								});
							popup += '</ul>';
						popup += '</div>';
						popup += '<div class="clear"></div>';
					popup += '</div>';
				}
	        });
			popup += '<div id="down">';
	        popup += '<p>Projects</p>';
	        popup += '<ul class="short">';
	        	$.each(data.projects, function(i, element){
		        	if (element.name != current){
						popup += '<li><a class="shortcuts" name="'+element.name+'" href="#">'+element.name+'</a></li>';
					}
				});
			popup += '</ul>';
			popup += '</div>';
	        popup += '</div>';
	    }).done(function() {
	    	if(windowWidth > 960){
		    	$.colorbox({
		    		width: "80%",
		    		height: "100%",
		    		scalePhotos: true,
		    		fixed: true,
		    		opacity: .8,
		    		close: "+",
		    		html:popup,
		    		onComplete:function(){
						$('.bxslider')
						.bxSlider({
							adaptiveHeight: true,
							video: true,
							useCSS: false,
							onBeforeSlide: function(){
								jQuery('video').each(function(){
									this.pause();
								})
							}
						});
		    		}
		    	});
	    	}else{
	    		$.colorbox({
		    		width: "100%",
		    		height: "100%",
		    		scalePhotos: true,
		    		fixed: true,
		    		opacity: .8,
		    		close: "+",
		    		html:popup,
		    		onComplete:function(){
						$('.bxslider').bxSlider({
							adaptiveHeight: true,
							video: true,
							useCSS: false,
							onBeforeSlide: function(){
								jQuery('video').each(function(){
									this.pause();
								})
							}
						});
		    		}
		    	});
	    	}
		})
		.fail(function() {
			console.log( "error see more project" );
		})
		event.preventDefault();
	});

	$(document).on("mouseenter", ".project", function(event){
		$(this).find('.info').stop().fadeOut(300);
		$(this).find('.info').fadeIn(300);
		if(isMobile().any()) $(this).find('.more.first').stop().fadeOut(300);
	});

	$(document).on("mouseleave", ".project", function(event){
		$(this).find('.info').stop().fadeIn(300);
		$(this).find('.info').fadeOut(300);
		if(isMobile().any()) $(this).find('.more.first').stop().fadeIn(300);
	});

	var $loading = $('#loadingDiv').hide();
	$(document)
	.ajaxStart(function () {
		$loading.show();
	})
	.ajaxStop(function () {
		$loading.hide();
		$("#projects").isotope('reLayout');
	});

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
	$("#image").fitText(.85);
	$("#management-marketing").fitText(1.44);
	$("#cinema-communication").fitText(1.35);

	// $("#but-also").fitText(2.3);
	// $("#designer").fitText(0.58);
	// $("#developer").fitText(0.78);

	$("#what-can-i-do").fitText(.81);
	$("#for-you").fitText(.47);
	$("#now").fitText(.45);

	$("#learn").fitText(2);
	$("#have-a-look").fitText(.95);
	$("#my-work").fitText(.4);

	$("#like").fitText(1);

	$("#see").fitText(1.1);
});