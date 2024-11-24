var ui = (function() {

	// Base elements
	var body, article, uiContainer, overlay, aboutButton, descriptionModal, printModal, saveModal;

	// Buttons
	var screenSizeElement, colorLayoutElement, targetElement, editElement, reviewElement, shareElement, printElement, saveElement, searchElement;

	// Work Counter
	var wordCountValue, wordCountBox, wordCountElement, wordCounter, wordCounterProgress;

	var expandScreenIcon = '&#xf000;';
	var shrinkScreenIcon = '&#xf001;';

	var darkLayout = false;

	function init() {
		
		bindElements();

		wordCountActive = false;

		if ( supportsHtmlStorage() ) {
			loadState();
		}

		console.log( "allo govner" );
	}

	function loadState() {

		// Activate word counter
		if ( localStorage['wordCount'] && localStorage['wordCount'] !== "0") {			
			wordCountValue = parseInt(localStorage['wordCount']);
			wordCountElement.value = localStorage['wordCount'];
			wordCounter.className = "word-counter active";
			updateWordCount();
		}

		// Activate color switch
		if ( localStorage['darkLayout'] === 'true' ) {
			if ( darkLayout === false ) {
				document.body.className = 'yang';
			} else {
				document.body.className = 'yin';
			}
			darkLayout = !darkLayout;
		}

	}

	function saveState() {

		if ( supportsHtmlStorage() ) {
			localStorage[ 'darkLayout' ] = darkLayout;
			localStorage[ 'wordCount' ] = wordCountElement.value;
		}
	}

	function bindElements() {

		// Body element for light/dark styles
		body = document.body;

		uiContainer = document.querySelector( '.ui' );

		// UI element for color flip
		//colorLayoutElement = document.querySelector( '.color-flip' );
		//colorLayoutElement.onclick = onColorLayoutClick;

		// UI element for full screen
		screenSizeElement = document.querySelector( '.fullscreen' );
		screenSizeElement.onclick = onScreenSizeClick;
		
		//UI element for search
		searchElement = document.querySelector( '.search');
		searchElement.onclick = onSearchClick;
		
		// UI element for color edit
		editElement = document.querySelector( '.edit' );
		editElement.onclick = onEditClick;
		
		// UI element for review
		//reviewElement = document.querySelector( '.review' );
		//reviewElement.onclick = onReviewClick;

		// UI element for print
		printElement = document.querySelector( '.print' );
		printElement.onclick = onPrintClick;

		// UI element for share
		shareElement = document.querySelector( '.share' );
		shareElement.onclick = onShareClick;		
		
		// UI element for save
		saveElement = document.querySelector( '.save' );
		saveElement.onclick = onSaveClick;
		
			
		document.addEventListener( "fullscreenchange", function () {
			if ( document.fullscreenEnabled === false ) {
				exitFullscreen();
			}
		}, false);

		// Overlay when modals are active
		overlay = document.querySelector( '.overlay' );
		overlay.onclick = onOverlayClick;

		article = document.querySelector( '.content' );
		article.onkeyup = onArticleKeyUp;

		wordCountBox = overlay.querySelector( '.wordcount' );
		wordCountElement = wordCountBox.querySelector( 'input' );
		wordCountElement.onchange = onWordCountChange;
		wordCountElement.onkeyup = onWordCountKeyUp;
		
		searchBoxElement = document.querySelector( '.searchbox' );
		descriptionModal = overlay.querySelector( '.description' );
		printModal = overlay.querySelector( '.print-dialog' );
		saveModal = overlay.querySelector ( '.save-dialog' );
		wordCounter = document.querySelector( '.word-counter' );
		wordCounterProgress = wordCounter.querySelector( '.progress' );

		aboutButton = document.querySelector( '.info' );
		aboutButton.onclick = onAboutButtonClick;
		
		header = document.querySelector( '.header' );
		header.onkeypress = onHeaderKeyPress;
	}

	function onScreenSizeClick( event ) {

		if ( document.fullscreenEnabled === false ) {
			enterFullscreen();
		} else {
			exitFullscreen();
		}
	}

	function enterFullscreen() {
		document.body.requestFullscreen( Element.ALLOW_KEYBOARD_INPUT );
		screenSizeElement.innerHTML = shrinkScreenIcon;	
	}

	function exitFullscreen() {
		document.exitFullscreen();
		screenSizeElement.innerHTML = expandScreenIcon;	
	}

	function onColorLayoutClick( event ) {
		if ( darkLayout === false ) {
			document.body.className = 'yang';
		} else {
			document.body.className = 'yin';
		}
		darkLayout = !darkLayout;

		saveState();
	}

	function onTargetClick( event ) {
		overlay.style.display = "block";
		wordCountBox.style.display = "block";
		wordCountElement.focus();
	}

	function onAboutButtonClick( event ) {
		overlay.style.display = "block";
		descriptionModal.style.display = "block";
	}
	function onPrintClick( event ) {
		overlay.style.display = "block";
		printModal.style.display = "block";
	}

	function onSaveClick( event ) {
		overlay.style.display = "block";
		saveModal.style.display = "block";
	}
		
	function onEditClick( event ) {
		
	}	

	function onReviewClick( event ) {
		
	}		

	function onShareClick( event ) {
		
	}
	
	function onSearchClick( event ) {
		searchBoxElement.style.display = "block";
	}
				
	/* Allows the user to press enter to tab from the title */
	function onHeaderKeyPress( event ) {

		if ( event.keyCode === 13 ) {
			event.preventDefault();
			article.focus();
		}
	}

	/* Allows the user to press enter to tab from the word count modal */
	function onWordCountKeyUp( event ) {
		
		if ( event.keyCode === 13 ) {
			event.preventDefault();
			
			setWordCount( parseInt(this.value) );

			removeOverlay();

			article.focus();
		}
	}

	function onWordCountChange( event ) {

		setWordCount( parseInt(this.value) );
	}

	function setWordCount( count ) {

		// Set wordcount ui to active
		if ( count > 0) {
			wordCountValue = count;
			wordCounter.className = "word-counter active";
			updateWordCount();
		} else {
			wordCountValue = 0;
			wordCounter.className = "word-counter";
		}
		
		saveState();
	}

	function onArticleKeyUp( event ) {

		if ( wordCountValue > 0 ) {
			updateWordCount();
		}
	}

	function updateWordCount() {

		var wordCount = editor.getWordCount();
		var percentageComplete = wordCount / wordCountValue;
		wordCounterProgress.style.height = percentageComplete * 100 + '%';

		if ( percentageComplete >= 1 ) {
			wordCounterProgress.className = "progress complete";
		} else {
			wordCounterProgress.className = "progress";
		}
	}

	function onOverlayClick( event ) {

		if ( event.target.className === "overlay" || event.target.className === "search") {
			removeOverlay();
		}
	}

	function removeOverlay() {
		overlay.style.display = "none";
		wordCountBox.style.display = "none";
		descriptionModal.style.display = "none";
		printModal.style.display = "none";
		saveModal.style.display = "none";
		searchBoxElement.style.display = "none";
	}

	return {
		init: init
	}

})();