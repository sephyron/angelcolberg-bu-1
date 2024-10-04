$(function(){

    var partners = [
        ['MediaTrax, LLC', 500, 'adv', true, true, "mediatrax.com", "2977 McFarlane Rd #304, Miami, FL 33133 USA", 'MediaTrax, LLC is a leader in wholesale online marketing services. We provide digital marketing infrastructure and end-to-end solutions that enable the channel (digital agencies, newspapers, Yellow Pages and digital publishers) to be more efficient and profitable. The MediaTrax Platform offers solutions for each major building block of the digital marketing arena: Pre-sales, Presence, Traffic & Tracking. Individual services can be ordered “a la carte” and on a pay-as-you-go basis. One solution to fit every need. Whether your company needs a landing site for just one advertiser or a full search marketing strategy with customized performance tracking.'],
        ['Haystack Digital', 1000, 'web', true, true, "haystak.com", "1525 Hendry St. Fort Myers, Florida 3390 USA", 'A full service internet marketing firm that provides effective Search Engine Marketing, Social Media Marketing, Email Marketing, Mobile Marketing, Reputation Management, Marketing Strategy Consultation and more.'],
        ['SuperMedia, LLC', 2500, 'web', true, false, "supermedia.com", "330 Old Country Rd, Mineola, NY 11501 USA", "I've been managing AdWords accounts of different sizes for over 5 years. I work on a policy of continuous improvement where a large part of my time is spent in learning researching and developing. This is not only for AdWords but in all forms of online marketing. I think this is a must considering the speed of change in AdWords, Google and the internet in general."],
        ['Revena', 1000, 'adv', true, true, "reneva.lv", "A.Deglava 45, Riga LV-1035 Latvia", 'Our company is founded on one principle - to be the best in the world at implementing high ROI online marketing campaigns, developing effective low cost web solutions, and providing quality customer care. Whether your prospects are searching on Google, reading reviews on yelp, chatting on Facebook, or browsing on their mobile, laptop or tablet, we can help you connect with them and turn them into paying customers.'],
        ['ReachLocal', 500, 'web', false, true, "reachlocal.com.au", "836 Wellington St, West Perth WA 6005 Australia", 'ReachLocal: Inc.’s (NASDAQ: RLOC) mission is to help small- and medium-sized enterprises (SMEs) acquire, maintain and retain customers via the Internet. ReachLocal offers a comprehensive suite of online marketing solutions, including search engine marketing (ReachSearch™), search engine optimisation (ReachSEO Plus), display advertising (ReachDisplay), retargeting advertising (ReachRetargeting), assisted live-chat technology (TotalLiveChat™) and online marketing analytics (TotalTrack®), each targeted to the SME market. ReachLocal delivers this suite of services to SMEs through a combination of its proprietary technology platform and its direct.'],
        ['Dex Media', 1000, 'web', false, true, "dexmedia.com", "2200 W Airfield Dr, Grapevine, TX 76051 USA", "A Google AdWords partner since 2006, Dex Media™ is a marketing solutions leader trusted by approximately 580,000 local business clients nationwide. We’re committed to helping our clients create and grow their customer relationships by providing a customizable mix of marketing solutions. These include websites, print, mobile, social media and search engine marketing. Marketing Consultants across the U.S. are helping businesses like yours stand out from the crowd. Depending on where you are located, one of our Marketing Consultants will work with you to help you get more customers and meet your business goals."],
        ['BoomTown', 2500, 'adv', true, true, "boomtownig.com", "166 W Butler Dr, Drums, PA 18222 USA", "Boomtown Internet Group is a full service Internet Marketing Company specializing in Pay-Per-Click Advertising, Search Engine Optimization Services, and Website Design and Development"],
        ['TopSpot Internet', 1000, 'web', true, true, "topspotims.com", "5120 Woodway Dr, Houston, TX 77056 USA", "TopSpot Internet Marketing has been a Google AdWords partner in the USA since 10/1/2008. Since 2003, TopSpot Internet Marketing has been helping B2B/industrial companies plan, implement & measure their online marketing efforts. Most importantly, TopSpot understands that more internet traffic does not necessarily equal success. Although every company may measure their success differently, the goal for building an effective search engine marketing plan is it must have a positive impact on your business. We understand that companies budgets vary, yet a web presence is vital."],
        ['Jumpfly, Inc', 500, 'adv', true, true, "jumpfly.com", "2541 Technology Dr, Elgin, IL 60124 USA", 'JumpFly professionally develops, implements, and manages Google AdWords, Bing Ads and Facebook PPC campaigns. We have been ranked the #1 PPC Company in the US by TopSEOs.com since 2008. We pride ourselves on our unmatched reputation of providing cutting edge knowledge and unmatched experience to maximize your PPC investment each month. We work month to month without contract and offer a money back guarantee. We are completely dedicated to customer satisfaction.'],
        ['Wahlstrom', 1000, 'adv', false, false, "wahlstrom.com", "800 Connecticut Ave, Norwalk, CT 06854 USA", "Wahlstrom is a leader in performance based marketing solutions. Since 1954, Wahlstrom has delivered quality leads by connecting brands with ready to buy consumers by working at the crossroads of time and location. By combining creative passion, strategic and technological insight, a belief in the power of partnerships, and a love for great ideas, we help drive our clients’ business further by delivering measurable results."],
        ['blue onion', 2500, 'web', true, true, "digourideas.com", "940 Wadsworth Blvd, Lakewood, CO 80214 USA", "Full Service Advertising Agency"],
        ['The EW Scripps', 1000, 'adv', true, true, "scripps.com", "312 Walnut St, Cincinnati, OH 45202 USA", "We are a Preston based full service internet, website design, search engine optimisation (SEO) and digital marketing agency with a wealth of experience providing clients with world class web solutions."],
        ['Scorpion Design', 500, 'adv', true, false, "scorpiondesign.com", "28480 Avenue Stanford, Valencia, CA 91355 USA", "Full service internet marketing company serving professionals across the country."],
        ['aimClear', 1000, 'adv', true, true, "aimclearblog.com", "9 W Superior St, Duluth, MN 55802 USA", "aimClear is an integrated social, search, PR & display marketing agency."],
        ['The Zimmerman', 2500, 'adv', true, true, "zadv.com", "2200 W Commercial Blvd, Fort Lauderdale, FL 33309 USA", "Zimmerman, an Omnicom Group company, is the leading national retail brand builder with more than 1100 associates and offices throughout the country."],
        ['Internet Marketing', 1000, 'adv', true, false, "aim-internet-marketing.com", "Juncal, Buenos Aires, Autonomous City, <br /> Argentin", "International digital marketing agency specializing in Google Adwords."],
        ['Marquette Group', 500, 'web', true, false, "marquettegroup.com", "222 NE Monroe St, Peoria, IL 61602 USA", "Marquette Group is an interactive agency that specializes in the strategic planning, buying and creation of media neutral, interactive programs with a unique and intimate understanding of national to local advertising. We will work with your team to create the building blocks for online media. We will plan your online business strategy to create awareness and drive lead generation, putting your brand at the very heart of the media landscape."],
        ['White Shark Media', 1000, 'adv', true, true, "whitesharkmedia.com", "2 South Biscayne Boulevard, Miami, Florida 33131 USA", "White Shark Media is a PPC management agency with offices in Miami, FL, Atlanta, GA, Nicaragua, Central America and Denmark, Scandinavia. We are focused on delivering a transparent and highly efficient management service for small to mid-sized businesses who are advertising online using Google AdWords or Bing Ads. With no contracts, no cancellation fees and low setup fees we work by following a principle that the Client's success should also result in our success and not before. Get in touch for a free AdWords analysis and proposal of what can be improved in your AdWords account."],
        ['Web.com', 2500, 'web', true, true, "web.com", "500 W Cummings Park #4500, Woburn, MA 01801 USA", "Web.com Group, Inc. (WWWW) provides a full range of Internet services to small businesses to help them compete and succeed online. Web.com is owner of several global domain registrars and further meets the needs of small businesses anywhere along their lifecycle with affordable, subscription-based solutions including website design and management, search engine optimization, online marketing campaigns, local sales leads, social media, mobile products, eCommerce solutions and call center services."],
        ['OrangeSoda, Inc', 1000, 'adv', true, true, "orangesoda.com", "732 E 930 S, American Fork, UT 84003 USA", "OrangeSoda helps businesses succeed online by taking all of the complicated jargon like SEO, PPC, Social, and HTML, and turning it into comprehensive marketing strategies stamped with personal service. Our dedicated team of experts give every business special care and clear reporting."],
        ['GlynnDevins', 500, 'adv', true, true, "glynndevins.com", "11230 College Blvd, Overland Park, KS 66210 USA", "Since 1987, GlynnDevins has specialized in advertising, marketing and occupancy solutions for senior living communities. Over the years, we've refined our methods with great precision - no matter your challenge, we'll take the lead role in our collaboration with you to determine what's going to work best. We offer senior living marketing solutions through a variety of services including: direct response, digital, creative, media, PR, social media, consulting and branding."],
        ['Qiigo Inc', 1000, 'web', true, false, "qiigo.com", "1455 Old Alabama Rd, Roswell, GA 30076 USA", "Local Marketing for National Brands Tools to manage Mobile, Social and Internet Marketing for thousands of locations."],
        ['Sweet Spot', 2500, 'adv', true, true, "sweetspotmarketing.com", "7101 College Blvd #404, Overland Park, KS 66210 USA", "Sweet Spot Marketing is a Kansas City based Search Engine Advertising Agency that is focused on developing, implementing and optimizing Search Engine Marketing campaigns. We specialize in Search Engine Optimization and Paid Search Advertising. Sweet Spot Marketing was founded in 2007 and is based in Overland Park, Kansas. Our Mission Sweet Spot Marketing exists to provide the best Search Engine Optimization and Paid Search Advertising support to small businesses, mid-sized companies and our partner agencies in the Kansas City area and across the Nation."],
        ['hibu US', 1000, 'adv', true, true, "business.hibu.com", "875 Roosevelt Hwy #220, Colchester, VT 05446 USA", "hibu has been a Google AdWords partner in the USA since 2006. hibu is here to help consumers find local businesses, browse products and services and buy locally. With a broad range of digital services to offer, hibu can help small businesses compete in the online world in next to no time at all. Together, we can help communities thrive"],
        ['Exults', 500, 'web', true, true, "exults.com", "1120 S Federal Hwy, Fort Lauderdale, FL 33316 USA", "Exults services many industries from vertical niche businesses to global brands. We have cultivated a specialty in Pay-Per-Click Management because we believe it is the most effective way to deliver measurable results. As a boutique agency we focus on offering unparalleled customer service. Our customer service focus drives us to custom-tailor each marketing campaign to fit the unique needs of our individual clients. In addition to a custom-tailored campaigns."],
        ['The Ohlmann', 1000, 'adv', true, true, "ohlmanngroup.com", "1605 N Main St, Dayton, OH 45405 USA", "The Ohlmann Group is a strategic marketing communications firm located in Dayton, Ohio. We use marketing strategy, media services, web development, creative design, search marketing, and public relations to help our clients create the future."],
        ['Adept Marketing', 2500, 'adv', true, true, "marketingadept.com", "815 Grandview Ave #600, Grandview Heights, OH 43212 USA", "Internet marketing company."],
        ['TriMark Digital', 1000, 'web', true, true, "trimarkdigital.com", "611 Tucker St, Raleigh, NC 27603 USA", "TriMark Digital specializes in internet marketing strategies to help your business succeed online. We offer Paid Search Marketing, Search Engine Optimization, Social Media Management, E-Commerce, Lead Generation, Video Production, Web Design & Web Development. Call us!"],
        ['Netbiz', 500, 'adv', true, false, "netbiz.com", "1830 Blankenship Rd, West Linn, OR 97068 USA", "NetBiz is committed to your success. Our goal is to provide high quality digital marketing services that produce results. We understand that having an experienced marketing partner can play a critical role in keeping your business running at peak performance. To achieve the best results possible your dedicated account manager will work closely with you to help achieve your strategic goals. Our commitment to quality and excellent service guides everything that we do. If you are interested in learning more about what we can do to help your business please call or send us an email."],
        ['G5', 1000, 'adv', true, true, "getg5.com", "550 NW Franklin Ave #200, Bend, OR 97701 USA", "G5 is the leading provider of Digital Experience Management® (DXM®) software and services in the property management sector. The G5 DXM Platform enables owners and operators of Multifamily, Self Storage, Senior Living, and Student Housing properties to deliver exceptional experiences at every digital touch point—turning customers into brand advocates. As brand advocacy grows, so does demand—allowing properties to raise rents and revenue without adversely affecting occupancy. Founded in 2005, Bend, Oregon-based G5 was recently named one of the fastest growing private US companies by Inc."],
        ['Netmark', 2500, 'web', true, true, "netmark.com", "20 Manton Ln, Bedford MK41 7NZ UK", "Netmark provides paid search services for clients across the United States and other countries by inquiry."],
        ['Trada Inc.', 1000, 'adv', false, true, "trada.com", "1023 Walnut St, Boulder, CO 80302 USA", "Trada is revolutionizing the way we build and manage PPC marketing campaigns through a crowdsourced online marketplace, in which a large community of online ad experts work together on paid search campaigns. The crowdsourced approach makes paid search accessible to all sizes of companies, and the collective wisdom of the crowd of experts brings results in scalability, diversity of thinking, and attention to detail."]
    ];

    for (i=0; i<partners.length; i++) {
        $('.items').append('<div data-index="'+i+'" class="item-'+(i+1)+'" style="background-image: url(v8/images/item3/images/2-4_'+(i+1)+'.png); background-repeat: no-repeat; background-position: 30px 30px;"><div class="white"></div><a href="#" class="company-link">'+partners[i][0]+'</a><a href="" class="contact-link contact-page"></a><div class="hover-card card-1"></div><div class="hover-card card-2"></div><div class="hover-card card-3"></div><a href="" class="contact-page contact-block"></a><a href="" class="profile-page profile-block">'+partners[i][0]+'</a><div class="hover"></div></div>');
    };

    var finded = [];

    var find = function(budget, help, hasUrl, hasLocation){
        var budget = budget.split('-'),
            list = [];
        for (i=0; i<partners.length; i++) {
            if ((budget=='0' || (partners[i][1]>=budget[0] && partners[i][1]<=budget[1])) && (help=='both' || partners[i][2]==help) && (!hasUrl || (hasUrl && partners[i][3])) && (!hasLocation || (hasLocation && partners[i][4])) ) list.push(i);
        };
        finded = list;
        return list;
    };
    var updateOne = function(final){
        var $checked = $('.one .checkbox_checked'),
            help = $checked.length>1 ? 'both' : $('.one .checkbox_checked').data('help'),
            hasUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test($('.one .field_url input').val()),
            hasLocation = $('.one .field_location input').val(),
            result = find('0', help, hasUrl, hasLocation);
        $('.button-default b, .head-count b').text(result.length);
        if (final===true) {
            $('.items').show().find(' > *').hide().each(function(i){
                if (result.indexOf(i)>=0) $(this).show();
            });
            $('.no-found').hide();
        };
    };
	
    $('.one .more .field input').on('keyup', updateOne);

    $('.button-default').click(function(){
		
		//$(".subheader").css({"marginTop":-6, "opacity":0});
        if (!$('.one .field_url input').val().length || /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test($('.one .field_url input').val())) {
            $('.one').css('top', -$(window).scrollTop());
            $(window).scrollTop(0);
            $('.sidebar .field_url input').val($('.one .field_url input').val()).trigger('keyup.check').trigger('change.check');
            $('.sidebar .field_location input').val($('.one .field_location input').val()).trigger('keyup.check').trigger('change.check');
            updateOne(true);
			$('#header').addClass('hide-search');
			$('.subheader').fadeOut(150);
			 $('.one').animate({ top: '-100%', opacity: 0 }, 750, 'easeInOutQuart', function(){
				$(this).hide().css({top: '100%'});	 
			 });
            $('.two').animate({ top: '0%' }, 750, 'easeInOutQuart', function(){
                
				$(this).addClass('two_fixed');
				$('.page').css({"height": "auto !important"});
				$('.search-link').fadeIn(500);
				$('.sort').delay(600).fadeIn(500);
                //$('.one').css('top', 0);
                
            });
            if ($('.one .checkbox_1.checkbox_checked').length) $('.sidebar .checkbox_1').addClass('checkbox_checked');
            if ($('.one .checkbox_2.checkbox_checked').length) $('.sidebar .checkbox_2').addClass('checkbox_checked');
			if ($('.one .checkbox_3.checkbox_checked').length) $('.sidebar .checkbox_3').addClass('checkbox_checked');
        }
        return false;
    });
    $('.search-link').on('click', function(e){
        e.preventDefault();
        if ($('.page').hasClass('two_sidebar')) {
            $('.page').removeClass('two_sidebar');
			$('.two').removeClass("sidebar-bg");	
			$('.two').removeClass('stop-scroll');
			
        } else {
            $('.page').addClass('two_sidebar');
			$('.two').addClass("sidebar-bg");	
			$('.two').addClass('stop-scroll');
        }
    });





	$('.side1').on('click', function(){
			$('.side2').addClass('move-left');
	});
	$('.side2').on('click', function(){
			//$('.side-w').addClass('move-right');
	})

    $('.sidebar .back').on('click', function(e){
        //e.preventDefault();
        $('.side2').removeClass('move-left');
    });
	
    $('.sidebar .close').on('click', function(e){
        e.preventDefault();
        $('.page').removeClass('two_sidebar');
		$('.side2').removeClass('move-left');
		
		$('.two').removeClass("sidebar-bg");	
		$('.two').removeClass('stop-scroll');
    });

    var offset = 50;
    $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
            $('.back-to-top').fadeIn(350);
			$(".head").addClass("head-bg");
        } else {
            $('.back-to-top').fadeOut(350);
			$(".head").removeClass("head-bg");
        }
    });

    $('.back-to-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 350);
        return false;
    });

    var threeIndex = 0;

    $('.company-link, .profile-page, .hover').on('click', function(e){
        //$('.two').css({ top: -$(window).scrollTop() });
		$('.two').addClass("profile-bg");
		$('#header').addClass('hide-search');	
		$('.two').addClass('stop-scroll');
		$('.page').removeClass("two_sidebar");
        $(window).scrollTop(0);
        $('body').addClass('body-three');
        var id = parseInt($(this).parent().attr('data-index'),10);
        threeIndex = finded.indexOf(id);
        $('.three .title').text( $(this).text() );
        $('.three').animate({ top: '0%' }, 750, 'easeInOutQuart', function(){
            $(this).addClass('three_fixed');
        });
        if (id%2==0) {
            $('.three__details__overlay').addClass('w_1')
        } else if (id%3==2) {
            $('.three__details__overlay').addClass('w_2');
        } else {
            $('.three__details__overlay').removeClass('w_1 w_2');
        }
        //$('.three__about').html(partners[id][7]);
        $('.three__address').html( partners[id][6] );
        $('.three__site').html( partners[id][5] );
        $('.three__email').html( 'info@' + partners[id][5] );
        $('.three__budget').html('$' + partners[id][1]);
        return false;
    });

    // var createAbout = function($block, text){
    //     $block.empty();
    //     var $small = $('<div class="three__about__small" />').appendTo($block),
    //         $large = $('<div class="three__about__large" />').appendTo($block);
    //     $small.html(text.length>600 ? text.substring(0, 540) + '...' + '<a href="#">more</a>' : text);
    //     $large.html(text);
    //     var smallHeight = $small.height(),
    //         largeHeight = $large.height();
    //     var $more = $small.find('a');
    //     $more.on('click', function(){
    //         $small.hide();
    //         $large.height(smallHeight).show().animate({ height: largeHeight }, 350, 'easeInOutQuart', function(){
    //             $('body, .three').height( $('.column-two').height() + 80);
    //         });
    //         return false;
    //     });
    // };

    $('.return').on('click', function(e){
        e.preventDefault();
        if (!$('body').hasClass('body-three-animated')) {
            $('body').removeClass('body-three');
            $('.column-one, .next').css({ marginTop: $(window).scrollTop() });
            $('.three').removeClass('three_fixed').animate({ top: '100%' }, 750, 'easeInOutQuart', function(){
                $('.column-one, .next').css({ marginTop: 0 });
                $(window).scrollTop( -parseInt($('.two').css('top')) + $(window).scrollTop() );
                $('.two').css({ top: '0%' });
            });
        };
        // $('.two').css({ top: $(window).scrollTop() });
		$('.two').removeClass("sidebar-bg");
		$('.two').removeClass("profile-bg");	
		$('.two').removeClass('stop-scroll');
    });

    $('.contact-page').on('click', function(e){
        e.preventDefault();
        $('.two').css({ top: -$(window).scrollTop() });
        $(window).scrollTop(0);
		$('.page').removeClass("two_sidebar");
        $('body').addClass('body-four');
        $('.four').fadeIn(350);
        $('.overlay').fadeIn(350);
    });

    $('.button-request').on('click', function(e){
        e.preventDefault();
        var email = $('.four .field_email input').val();
        if (!email.length || emailPattern.test(email)) {
            $('.five').show();
            $('.four input, .four textarea').val('');
            $('.four select').select2('val', '0');
        }
    });

    var updateTwo = function(){
        var $checked = $('.sidebar .checkbox_checked'),
            help = $checked.length>1 ? 'both' : $('.sidebar .checkbox_checked').data('help'),
            budget = $('.budget select').val(),
            hasUrl = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test($('.sidebar .field_url input').val()),
            hasLocation = $('.sidebar .field_location input').val();
        var result = find(budget, help, hasUrl, hasLocation);
        $(' .head-count b').text(result.length);
        if (result.length) {
            $('.no-found').hide();
            var $wrap = $('.items'),
                $items = $wrap.find('> *').stop();
            $wrap.fadeOut(350, function(){
                $(window).scrollTop(0);
                $items.hide();
                $wrap.show();
                var index = 0;
                $items.stop().each(function(i){
                    if (result.indexOf(i)>=0) {
                        $(this).css('opacity', 0).show().delay(100 * index).fadeTo(225, 1);
                        index++;
                    }
                });
            });
        } else {
            $('.items').hide();
            $('.no-found').show().find('b').text('"'+ $('.budget select option[value='+budget+']').text() +'"');
        }
		$('.sidebar .update').css({"background-color":"#00bcd4"});
    };
$('.sidebar .update').on('click', function(){
	updateTwo();
})
    $('.sidebar .checkbox_1, .sidebar .checkbox_2').click(function(){
        if (!$(this).hasClass('checkbox_checked')) {
            $(this).addClass('checkbox_checked');
			$('.sidebar .checkbox_3').removeClass('checkbox_checked');
            updateTwo();
        } else if ($('.sidebar .checkbox_checked').length>1) {
            $(this).removeClass('checkbox_checked');
            updateTwo();
        }
		
			

    });
	
    $('.sidebar .checkbox_3').click(function(){
        if (!$(this).hasClass('checkbox_checked')) {
            $(this).addClass('checkbox_checked');
			$('.sidebar .checkbox_1, .sidebar .checkbox_2').removeClass('checkbox_checked');
            updateTwo();
        } else if ($('.sidebar .checkbox_checked').length>1) {
            $(this).removeClass('checkbox_checked');
            updateTwo();
        }
		
			

    });	
	
	

    $('.select').select2({
        minimumResultsForSearch: 8
    }).on('change.human', updateTwo);



//Main Checkbox


    $('.one .checkbox_1').click(function(){
		$(".one .checkboxes").addClass('collapsed');
        if (!$('.one .checkbox_checked').length) {
			
            $('.choose').delay(600).animate({ marginTop: 0 }, 450, 'easeInOutQuart').find('.checked').fadeIn(450);
            $('.more').slideDown(350).animate({ opacity: 1 }, { duration: 450, easing: 'easeInOutQuart', queue: false });
			
        };
        if (!$(this).hasClass('checkbox_checked')) {
				
				$(this).addClass('checkbox_checked');
				//$(".checkbox_3").removeClass('checkbox_checked');
				
				
			
        } else if ($('.one .checkbox_checked').length>1) {
            $(this).removeClass('checkbox_checked');
			//$(".one .checkbox").removeClass('checkbox_checked');
        };
        updateOne();
		$(".upper").fadeOut(100);
		
		$(".checkbox_3").removeClass('checkbox_checked');
		$(".url-tooltip").addClass("url-tooltip-show");
		
    });

    $('.one .checkbox_2').click(function(){
		$(".one .checkboxes").addClass('collapsed');
        if (!$('.one .checkbox_checked').length) {
			
            $('.choose').delay(600).animate({ marginTop: 0 }, 450, 'easeInOutQuart').find('.checked').fadeIn(450);
            $('.more').slideDown(350).animate({ opacity: 1 }, { duration: 450, easing: 'easeInOutQuart', queue: false });
			
        };
        if (!$(this).hasClass('checkbox_checked')) {
				
				$(this).addClass('checkbox_checked');
				//$(".checkbox_3").removeClass('checkbox_checked');
				
				
			
        } else if ($('.one .checkbox_checked').length>1) {
            $(this).removeClass('checkbox_checked');
			//$(".one .checkbox").removeClass('checkbox_checked');
        };
        updateOne();
		$(".upper").fadeOut(100);
		
		$(".checkbox_3").removeClass('checkbox_checked');
		$(".url-tooltip").addClass("url-tooltip-show");
		
    });

$('.one .checkbox_3').click(function(){
	$(".one .checkboxes").addClass('collapsed');
        if (!$('.one .checkbox_checked').length) {
			
            $('.choose').delay(600).animate({ marginTop: 0 }, 450, 'easeInOutQuart').find('.checked').fadeIn(450);
            $('.more').slideDown(350).animate({ opacity: 1 }, { duration: 450, easing: 'easeInOutQuart', queue: false });
			
        };
        if (!$(this).hasClass('checkbox_checked')) {
			$(".checkbox").removeClass('checkbox_checked');
           $(this).addClass('checkbox_checked');
			
					
				
			} else if ($(this).hasClass('checkbox_checked')) {
			$(".checkbox").removeClass('checkbox_checked');
            //$(this).removeClass('checkbox_checked');
			
			
        };	
			
			
        /*} else if ($('.one .checkbox_checked').length>1) {
			$(".one .checkbox").removeClass('checkbox_checked');
            $(this).removeClass('checkbox_checked');
			
			
        };*/
        updateOne();
		$(".upper").fadeOut(100);
		
		$(".url-tooltip").addClass("url-tooltip-show");
    });







    $('.field input, .field textarea').on({
        focus: function(){
            $(this).parent().addClass('field_focus');
        },
        blur: function(){
            $(this).parent().removeClass('field_focus');
        },
        'keyup.check': function(){
            if ($(this).val().length) {
                $(this).parent().addClass('field_filled');
            } else {
                $(this).parent().removeClass('field_filled');
            }
        }
    });

    $('.field_url input').on('change.check', function(){
        if (!$(this).val().length || /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test($(this).val())) {
            $(this).parent().removeClass('field_error');
        } else {
            $(this).parent().addClass('field_error');
        }
    });

    $('.four .close, .search-again, .logo').on('click', function(e){
        e.preventDefault();
		$('.two').removeClass("sidebar-bg");
				
			$('.two').removeClass('stop-scroll');
			$('.page').removeClass('two_sidebar');
        if (!$('.body-six').length) $('.overlay').fadeOut(350);
        $('body').removeClass('body-four');
        $('.four').fadeOut(350, function(){
            $(".five").hide();
             if ($('.body-six').length) {
                $(window).scrollTop( -parseInt($('.six').css('top'),10) + $(window).scrollTop() );
                $('.six').css({ top: 0, paddingBottom: 0 });
             }
        });
        if ($('.body-six').length && !$(this).is('.search-again') && !$(this).is('.logo')) {
            //
        } else if ($('.three_fixed').length) {
            $(window).scrollTop( -parseInt($('.column-two').css('top'),10) );
            $('.column-two').css({ top: 0 });
        } else if ($('.two_fixed').length) {
            $(window).scrollTop( -parseInt($('.two').css('top')) + $(window).scrollTop() );
			$('.page').css({"height": $(window).height()});
            $('.two').css({ top: '0%' });
        };
        if ($(this).is('.logo')) {
			
			$('.two').removeClass("sidebar-bg");
			$('.two').removeClass("profile-bg");	
			$('.two').removeClass('stop-scroll');
            $('.overlay').fadeOut(350);
            $('body').removeClass('body-three body-six');
            $('.six').animate({ top: '100%' }, 750);
            $('.three_fixed').removeClass('three_fixed').animate({ top: '100%' }, 750, 'easeInOutQuart');
            $('.two_fixed').removeClass('two_fixed two_sidebar').animate({ top: '100%' }, 750, 'easeInOutQuart', function(){
                $('.head-count b').text(100);
                $('.budget .select').select2('val', '0');
                $('.sidebar .checkbox').removeClass('checkbox_checked');
            });
            $('.choose').css({ marginTop: 0 });
            $('.one .checkbox').removeClass('checkbox_checked');
			$('.one .checkboxes').removeClass('collapsed');
            $('.one .more .field').removeClass('field_error field_filled').find('input').val('');
            $('.button-default b').text(100);
            $('.more').hide();
			$('#header').removeClass('hide-search');
            $('.upper, .subheader').fadeIn(1000);
			$(".one").show().delay(500).animate({ top: '0%', opacity: 1 }, 750, 'easeInOutQuart');
        };
		
		if ($(this).is('.search-again')){
			$('.three_fixed').removeClass('three_fixed').animate({ top: '100%' }, 750, 'easeInOutQuart');
			$('.two').removeClass("sidebar-bg");
			$('.two').removeClass("profile-bg");	
			$('.two').removeClass('stop-scroll');
		}
		
		
		
    });

    $('.sidebar .field_location input').on('change.human', updateTwo);

    $('.sidebar .field_url input').on('change.human', function(){
        if (!$(this).val().length || /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi.test($(this).val())) {
            if ($(this).parent().parent().is('.sidebar')) updateTwo();
        }
    });

    $('.four-select').select2({
        minimumResultsForSearch: 8,
        dropdownCssClass: 'four-select-dropdown'
    });

    var bindInThree = function(){
        $('.three .six-link').on('click', function(e){
            $('.column-two').css({ top: -$(window).scrollTop() });
            $(window).scrollTop(0);
            $('body').addClass('body-six');
            $('.overlay').fadeIn(350);
            $('.six').animate({ top: '100%' }, 750, 'easeInOutQuart');
            return false;
        });
        $('.three .column-one .contact').on('click', function(e){
            e.preventDefault();
			//$('.three_fixed').removeClass('three_fixed').animate({ top: '100%' }, 750, 'easeInOutQuart');
			$('.page').removeClass("two_sidebar");
            $('.column-two').css({ top: -$(window).scrollTop() });
            $(window).scrollTop(0);
            $('body').addClass('body-four');
			
            $('.four').fadeIn(350);
            $('.overlay').fadeIn(350);
        });
    };
    bindInThree();

    $('.six .close').on('click', function(e){
        $('body').removeClass('body-six');
        $('.overlay').fadeOut(350);
        $('.six').animate({ top: '100%' }, 750, 'easeInOutQuart', function(){
            $(window).scrollTop( -parseInt($('.column-two').css('top'),10) + $(window).scrollTop() );
            $('.column-two').css({ top: 0 });
        });
        return false;
    });

    $('.six-contact').on('click', function(){
        $('.six').css({ 'top': -$(window).scrollTop(), paddingBottom: $(window).scrollTop() });
        $(window).scrollTop(0);
		$(".six").hide();
        $('body').addClass('body-four');
		
        $('.four').fadeIn(350);
    });

    var slideThree = function(){
        var $three = $('.three'),
            $wrapper = $three.find('.wrapper'),
            $clone = $wrapper.clone().addClass('wrapper_new'),
            isNext = $(this).hasClass('next');
        $three.find('.next, .prev').off('click');
        $three.removeClass('three_fixed').find('.column-two').css('top', -$(window).scrollTop());
        $('body').addClass('body-three-animated');
        $wrapper.animate({ left: isNext ? '-100%' : '100%' }, 750, 'easeInOutQuart', function(){
            $wrapper.remove();
            $three.addClass('three_fixed');
            $('body').removeClass('body-three-animated');
        });
        threeIndex = isNext ? threeIndex+1 : threeIndex-1;
        if (threeIndex>finded.length-1) threeIndex=0;
        if (threeIndex<0) threeIndex=finded.length-1;
        $clone.find('.title').text( partners[finded[threeIndex]][0] );
        $clone.prependTo($three).css('left', isNext ? '150%' : '-150%').animate({ left: '50%' }, 750, 'easeInOutQuart', function(){
            $three.find('.next, .prev').on('click', slideThree);
            $clone.removeClass('wrapper_new').css('left', '0%');
            bindInThree();
        });
       /* 
		if (finded[threeIndex]%2==0) {
            $clone.find('.three__details__overlay').addClass('w_1')
        } else if (finded[threeIndex]%3==2) {
            $clone.find('.three__details__overlay').addClass('w_2')
        } else {
            $clone.find('.three__details__overlay').removeClass('w_1 w_2');
        }
        $clone.find('.three__about').html( partners[finded[threeIndex]][7] );
		$clone.find('.three__budget').html( '$' + partners[finded[threeIndex]][1] );
		*/
        $clone.find('.three__address').html( partners[finded[threeIndex]][6] );
        $clone.find('.three__site').html( partners[finded[threeIndex]][5] );
        $clone.find('.three__email').html( 'info@' + partners[finded[threeIndex]][5] );
        
		
        $(window).scrollTop(0);
    };

    $('.three .next, .three .prev').on('click', slideThree);

    var emailPattern = /^[0-9а-яА-Яa-zA-ZёЁ\.\_\-]+@[0-9а-яА-Яa-zA-ZёЁ\.\_\-]+\.[0-9а-яА-Яa-zA-ZёЁ\.\-]{2,6}$/;

    $('.four .field_email input').on('change.check', function(){
        if (!$(this).val().length || emailPattern.test($(this).val())) {
            $(this).parent().removeClass('field_error');
        } else {
            $(this).parent().addClass('field_error');
        }
    });


    // $('.company-link:first').click();
	
	
	$('.page').css({'height': $(window).height() });
	
	$(window).on('change', function(){
	
	})

});