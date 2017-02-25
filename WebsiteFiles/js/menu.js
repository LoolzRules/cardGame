// INITIALIZING ALL GLOBAL VARIABLES AND CONSTANTS
const err = '<span id="errSpan"></span>';
const deckInfo = '<div id="deckInfo">'
			+ '<div class="infoHolder"><div class="infoBar"></div></div>'
			+ '<div class="infoHolder"><div class="infoBar"></div></div>'
			+ '<div class="infoHolder"><div class="infoBar"></div></div>'
			+ '<div class="infoHolder"><div class="infoBar"></div></div>'
			+ '<div class="infoHolder"><div class="infoBar"></div></div>'
			+ '<div class="infoHolder"><div class="infoBar"></div></div>'
			+ '<div class="infoHolder"><div class="infoBar"></div></div>'
			+ '<span>1</span>'
			+ '<span>2</span>'
			+ '<span>3</span>'
			+ '<span>4</span>'
			+ '<span>5</span>'
			+ '<span>6</span>'
			+ '<span>7+</span'
			+ '<div>';
const dur = 700;
const warListDiv = '<div class="cardListWar" data-fid="1"></div>';
const sciListDiv = '<div class="cardListSci" data-fid="2"></div>';
const artListDiv = '<div class="cardListArt" data-fid="3"></div>';
const infoNum = 10;


var activePage = 0;
var maxPages;

var $pages;
var $deckList = $( '#deckList' );
var $cardList = $( '#cardList' );
var $deckScroller = $( '#deckScroller' );
var $cardScroller = $( '#cardScroller' );
var $scrollBar = $( '#scrollBar' );
var $scroller = $( '#scroll' );
var $chooseDeckFaction = $( '#chooseDeckFaction' );
var $newDeck = $( '#newDeck' );
var $backButton = $( '#backButton' );
var $chooseDeckForGame = $( '#chooseDeckForGame' );

// INITIALIZING SCROLLER
$scroller.draggable({
	axis: "y",
	containment: "parent"
});

// IMAGES PRELOADER
$.preloadImages = function() {
	for (var i = 0; i < arguments.length; i++) {
		$("<img />").attr("src", arguments[i]);
	}
}

// ANIMATIONS CHAINING
$.chain = function() {
	var promise = $.Deferred().resolve().promise();
	jQuery.each( arguments, function() {
		promise = promise.pipe( this );
	});
	return promise;
};


// ADJUSTING SCROLLER
function adjustScroller( element ) {
	var hDiff = $( element ).height() - $deckList.height();

	if ( hDiff > 0 ) {
		$scroller.css('display', 'block');
		var scrHDiff = $scrollBar.height() - $scroller.height();
		$scroller.off( "drag" );
		$scroller.on( "drag", function( event, ui ) {
			$( element ).css('top', -hDiff*ui.offset.top/scrHDiff);
		});
	} else {
		$scroller.css('display', 'none');
	}
}
// ADJUSTING DECK INFO
function adjustInfo( curDeck ) {

	var $deckInfo = $deckList.children( '.deckButton' ).children( '#deckInfo' );

	var nums = [0, 0, 0, 0, 0, 0, 0];

	for(let i=0; i<curDeck.deckCards.length; i++) {
		if (curDeck.deckCards[i].AP > 7) {
			nums[6] += curDeck.deckCards[i].num;
		} else {
			nums[curDeck.deckCards[i].AP-1] += curDeck.deckCards[i].num;
		}
	}

	$deckInfo.children( '.infoHolder' ).each( function( index, element ) {
		$( this ).children( '.infoBar' ).css('top', (10-nums[index])*10 + '%');
	});
}


// ELEMENT GENERATING FUNCTIONS
function cardGenerator( card ) {
	var faction;
	if (card.FID == 1) {
		faction = 'war';
	} else if (card.FID == 2) {
		faction = 'sci';
	} else {
		faction = 'art';
	}
	
	return '<div class="card ' + faction + '" data-ap="' + card.AP + '"'
			+ ' data-num="'+ card.num + '" data-cid="'+ card.CID + '">'
			+ '<span class="cardAP">' + card.AP + '</span>'
			//+ '<img src="'	+ card.picture_link + '">'
			+ '<div class="portrait" style="background-position:' + card.cX*100/59 + '%;"></div>'
			+ '<div class="cardName"><span class="cardName">' + card.name + '</span></div>'
			+ '<div class="cardDesc"><span class="cardDesc">' + card.description + '</span></div>'
			+ '<span class="cardHP">' + card.HP + '</span>'
			+ '<span class="cardDP">' + card.DP + '</span>'
			+ '<span class="cardNum">' + card.num + '</span>'
			+ '</div>';
}
function deckCardGenerator( card ) {
	return '<div class="deckCard"'
			+ ' data-num="' + card.num + '"'
			+ ' data-ap="' + card.AP + '"'
			+ ' data-cid="' + card.CID + '">'
			+ '<span class="deckCardAP">' + card.AP + '</span>'
			+ '<span class="deckCardName">' + card.name + '</span>'
			+ '<span class="deckCardNum">' + card.num + '</span>'
			+ '</div>';
}
function deckButtonGenerator( deck ) {
	return '<div class="deckButton" data-fid="' + deck.FID + '"'
			+ ' data-did="' + deck.DID + '">'
			+ '<button class="removeDeck">✖</button>'
			+ '<span class="deckName">' + deck.name + '</span>'
			+ '</div>';
}
function deckButtonsGenerator( deckButton ) {
	var deckDivs = "";
	for (let i=0; i<deckButton.length; i++) {
		deckDivs += deckButtonGenerator(deckButton[i]);
	}
	return deckDivs;
}
function deckListGenerator( deckList ) {
	var deckCardsList = "";
	var faction;
	for (let i=0; i<deckList.deckCards.length; i++) {
		deckCardsList += deckCardGenerator( deckList.deckCards[i] );
	}
	return deckCardsList;
}


// CARD FILTERING FUNCTIONS
function findClosestVisible() {

	newActivePage = activePage;
	while (newActivePage > -1) {
		if ($pages.eq(newActivePage).children( '.hidden' ).length
		== $pages.eq(newActivePage).children().length
		|| $pages.eq(newActivePage).hasClass('hidden')) {
			newActivePage--;
		} else {
			return newActivePage;
		}
	}

	newActivePage = activePage+1;
	while (newActivePage < maxPages) {
		if ($pages.eq(newActivePage).children( '.hidden' ).length
		== $pages.eq(newActivePage).children().length
		|| $pages.eq(newActivePage).hasClass('hidden')) {
			newActivePage++;
		} else {
			return newActivePage;
		}
	}
	return null;
}
function filterCardsByAP( ap ) {
	if (ap == 0) {
		$cardList.children('div').each( function( index, element ) {
			$( element ).children().each( function( ind, elem ) {
				$( elem ).removeClass('hidden');
			});
		});
	} else {
		if (ap == 7) {
			$cardList.children('div').each( function( index, element ) {
				$( element ).children().each( function( ind, elem ) {
					if ($( elem ).attr('data-ap') >= 7) {
						$( elem ).removeClass('hidden');
					} else {
						$( elem ).addClass('hidden');
					}
				});
			});
		} else {
			$cardList.children('div').each( function( index, element ) {
				$( element ).children().each( function( ind, elem ) {
					if ($( elem ).attr('data-ap') == ap) {
						$( elem ).removeClass('hidden');
					} else {
						$( elem ).addClass('hidden');
					}
				});
			});
		}

		var nap = findClosestVisible();
		if (nap!=null) {
			$pages.eq(activePage).css('display', 'none');
			activePage = nap;
			$pages.eq(activePage).css('display', 'block');
		}
	}
}
function filterCardsByFaction( fNum ) {
	if (fNum == 0) {
		$cardList.children( 'div' ).each( function( index, elem ) {
			$( elem ).removeClass('hidden');
		});
	} else {
		$cardList.children( 'div' ).each( function( index, elem ) {
			if($( elem ).attr('data-fid') == fNum) {
				$( elem ).removeClass('hidden');
			} else {
				$( elem ).addClass('hidden');
			}
		});

		var nap = findClosestVisible();
		if (nap!=null) {
			$pages.eq(activePage).css('display', 'none');
			activePage = nap;
			$pages.eq(activePage).css('display', 'block');
		}
	}
}


// DECK MANAGING FUNCTIONS
function setCardNumbers( deck ) {
	if (!deck) {
		$( '#cardList' ).children( 'div:not(.hidden)' ).each( function( index, element ) {
			$( element ).children().each( function( ind, elem ) {
				$( elem ).removeClass('greyCard');
				$( elem ).children( '.cardNum' ).text($( elem ).attr('data-num'));
			});
		});
	} else {
		var i = 0;
		var numOfCards = 30;
		$( '#cardList' ).children( 'div:not(.hidden)' ).each( function( index, element ) {
			$( element ).children().each( function( ind, elem ) {
				if (numOfCards > 0 && $( elem ).attr('data-cid')==deck.deckCards[i].CID) {
					var diff = $( elem ).attr('data-num')-deck.deckCards[i].num;
					if (diff == 0) {
						$( elem ).addClass('greyCard');
					}
					
					$( elem ).children( '.cardNum' ).text(diff);
					numOfCards -= deck.deckCards[i].num;
					i++;
				}
			});
		});
	}
}
function addCard( curDeck, $me ) {
	let myCID = $me.attr('data-cid');
	let myAP = $me.attr('data-ap');
	let $num = $me.children( '.cardNum' );
	var length = 0;

	for(let i=0; i<curDeck.deckCards.length; i++) {
		length += curDeck.deckCards[i].num;
	}

	if(length<30) {
		if ($num.text() == 2) {

			$num.text(1);

			let beforeIndex = 0;
			let kids = $cardScroller.children();
			kids.each( function( ind, elem ) {
				if ($( elem ).attr('data-ap')<=myAP && $( elem ).attr('data-cid')*1<myCID) {
					beforeIndex++;
				} else {
					return false;
				}
			});

			var card = {
				'CID': $me.attr('data-cid')*1,
				'AP': $me.attr('data-ap')*1,
				'name': $me.children( '.cardName' ).text(),
				'num': 1
			}

			curDeck.deckCards.splice(beforeIndex, 0, card);

			if (beforeIndex<kids.length) {
				kids.eq(beforeIndex).before(deckCardGenerator(card));
			} else {
				if (beforeIndex != 0) {
					beforeIndex--;
					kids.eq(beforeIndex).after(deckCardGenerator(card));
				} else {
					$cardScroller.append(deckCardGenerator(card));
				}
			}

			adjustScroller($cardScroller);

		} else if ($num.text() == 1) {
			$cardScroller.children().each( function( ind, elem ) {
				if ($( elem ).attr('data-cid') == myCID) {
					$num.text(0);
					$me.addClass('greyCard');
					$( elem ).attr('data-num', 2);
					$( elem ).children( '.deckCardNum' ).text(2);
					curDeck.deckCards[ind].num = 2;
				}
			});
		}

		let l=0;
		for(let i=0; i<curDeck.deckCards.length; i++) {
			l += curDeck.deckCards[i].num;
		}

		adjustInfo(curDeck);

	}
}
function removeCard( curDeck, $me ) {
	let myCID = $me.attr('data-cid');
	let $num = $me.children( '.deckCardNum' );

	if ($num.text() == 1) {
		$me.remove();
		adjustScroller($cardScroller);
	} else {
		$num.text($num.text()-1);
	}

	$cardList.children( 'div' ).each(function(i, e) {
		$( this ).children().each(function(ind, elem) {
			if ($( elem ).attr('data-cid')==myCID) {
				let $cardNum = $( elem ).children( '.cardNum' );
				if ($cardNum.text()==0) {
					$( elem ).removeClass('greyCard');
				}
				$cardNum.text($cardNum.text()*1+1);

				for(let i=0; i<curDeck.deckCards.length; i++) {
					if (curDeck.deckCards[i].CID == myCID) {
						if (curDeck.deckCards[i].num == 1) {
							curDeck.deckCards.splice(i, 1);
						} else {
							curDeck.deckCards[i].num -= 1;
						}
						break;
					}
				}

				return false;
			}
		});
	});

	adjustInfo(curDeck);
}


function main( data ) {

	var myCards, myDecks;
	var myWar = [];
	var mySci = [];
	var myArt = [];

	$backButton.on("click.menu", function() {
		$( '#mainMenu' ).animate(
			{
				'margin-left': '0'
			},
			{
				duration: 500
			}
		);
	});

	// ARRANGE CARDS ON PAGES
	for (let i = 0; i<data.cards.length; i++) {
		if (data.cards[i].FID == 1) {
			myWar.push(cardGenerator(data.cards[i]));
		} else if (data.cards[i].FID == 2) {
			mySci.push(cardGenerator(data.cards[i]));
		} else {
			myArt.push(cardGenerator(data.cards[i]));
		}
	}

	var parentDiv;
	for (let i = 0; i<myWar.length; i++) {
		if (i % 8 == 0) {
			$cardList.append(warListDiv);
			parentDiv = $( '#cardList>.cardListWar:last-child' );
		}
		parentDiv.append(myWar[i]);
	}
	for (let i = 0; i<mySci.length; i++) {
		if (i % 8 == 0) {
			$cardList.append(sciListDiv);
			parentDiv = $( '#cardList>.cardListSci:last-child' );
		}
		parentDiv.append(mySci[i]);
	}
	for (let i = 0; i<myArt.length; i++) {
		if (i % 8 == 0) {
			$cardList.append(artListDiv);
			parentDiv = $( '#cardList>.cardListArt:last-child' );
		}
		parentDiv.append(myArt[i]);
	}


	// INITIALIZE MAXPAGES
	maxPages = $cardList.children( 'div' ).length - 1;

	// MAKE THE 1st DIV VISIBLE 
	$cardList.children( 'div' ).eq(activePage).css('display', 'block');

	// FILTER CARDS BY AP
	$( '#manaButtonsHolder' ).delegate('.manaButton', "click", function( event ) {
		filterCardsByAP($( this ).attr('value'));
	});

	// FILTER CARDS BY FACTION
	$( '#fracButtonsHolder' ).delegate('.fracButton', "click.APfilter", function( event ) {
		filterCardsByFaction($( this ).attr('value'));
	});



	// TURN PAGES 
	$pages = $cardList.children( 'div' );
	var newActivePage;

	$( '#prevPage' ).on('click', function() {
		newActivePage = activePage-1;

		while (newActivePage > -1) {
			if ($pages.eq(newActivePage).children( '.hidden' ).length
			== $pages.eq(newActivePage).children().length
			|| $pages.eq(newActivePage).hasClass('hidden')) {
				newActivePage--;
			} else {
				break;
			}
		}
		if (newActivePage > -1) {
			$pages.eq(activePage).css('display', 'none');
			activePage = newActivePage;
			$pages.eq(activePage).css('display', 'block');
		}
	});
	$( '#nextPage' ).on('click', function() {
		newActivePage = activePage+1;

		while (newActivePage < maxPages+1) {
			if ($pages.eq(newActivePage).children( '.hidden' ).length
				== $pages.eq(newActivePage).children().length
				|| $pages.eq(newActivePage).hasClass('hidden')) {
				newActivePage++;
			} else {
				break;
			}
		}
		if (newActivePage < maxPages+1) {
			$pages.eq(activePage).css('display', 'none');
			activePage = newActivePage;
			$pages.eq(activePage).css('display', 'block');
		}
	});


	// ATTACH DECKLIST
	$deckScroller.prepend(deckButtonsGenerator(data.decks));

	// ATTACH SCROLLER TO DECKLIST
	adjustScroller($deckScroller);
	var deckScrollerHeight = $deckScroller.height();

	// DELETE DECK
	$deckScroller.delegate('.deckButton>.removeDeck', "click", function( event ) {
		// STOP EVENT
		event.stopPropagation();

		// GETTING PARENT INFO
		var $parentDeck = $( this ).parent();
		var myDID = $parentDeck.attr('data-did');

		$.post(
			"php/deleteDeck.php",
			{ "did": myDID },
			function( data ) {
				console.log(data);
			}
		);

		// REMOVING THE DECK FROM BOTH ARRAY AND INTERFACE
		$parentDeck.remove();
		for(let i=0; i<data.decks.length; i++) {
			if (data.decks[i].DID == myDID) {
				data.decks.splice(i, 1);
				break;
			}
		}

		deckScrollerHeight -= 60;
	});

	// CREATE NEW DECK
	$newDeck.on("click", function( event ) {

		deckScrollerHeight += 60;

		$chooseDeckFaction.css('display', 'block');
		$chooseDeckFaction.delegate('.deckFactionButton', "click", function() {

			$backButton.off("click.menu");

			// CHOOSING FACTION
			$chooseDeckFaction.css('display', 'none');
			var fid = $( this ).val();
			$chooseDeckFaction.undelegate('.deckFactionButton', "click");

			// FILTERING CARDS
			filterCardsByFaction(fid);
			$( '#fracButtonsHolder' ).undelegate('.fracButton', "click.APfilter");
			$( '#fracButtonsHolder' ).children( ':not([value="'+fid+'"])').addClass('greyCard');

			// APPENDING DECK BUTTON
			$deckList.append(deckButtonGenerator({
				'DID': 0,
				'FID': fid,
				'name': 'New Deck'
			}));
			var $deckButton = $deckList.children( '.deckButton' );
			$deckButton.css({
				'top': 0,
				'transform': 'scale(1, 1)',
				'-ms-transform': 'scale(1, 1)',
				'-webkit-transform': 'scale(1, 1)',
				'display': 'none'
			});
			var text = $deckButton.children( '.deckName' ).text();
			$deckButton.children( '.deckName' ).remove();
			$deckButton.append('<input type="text" class="deckName" value="'+text+'">');

			var topOffset = $newDeck.offset().top;
			var index = $deckScroller.children().index($newDeck);

			// ANIMATIONS
			$newDeck.fadeOut({
				duration: 200,
				easing: 'linear'
			});
			$deckButton.delay(dur-200).fadeIn({
				duration: 200,
				easing: 'linear'
			});
			$deckScroller.animate(
				{
					top: -deckScrollerHeight
				},
				{
					duration: dur,
					easing: 'linear',
					complete: function() {
						$deckScroller.css('display', 'none');
						$cardScroller.css({
							'display': 'block',
							'top': 0
						});
					}
				}
			);

			// CREATING DECK OBJECT
			var curDeck = {
				'DID': 0,
				'FID': fid,
				'name': 'New Deck',
				'deckCards': []
			};

			// FILTERING CARDS
			filterCardsByFaction(fid);
			$( '#fracButtonsHolder' ).undelegate('.fracButton', "click.APfilter");
			$( '#fracButtonsHolder' ).children( ':not([value="'+fid+'"])').addClass('greyCard');

			// ADJUST DECK INFO
			$deckButton.append(deckInfo);
			adjustInfo(curDeck);

			// ADD CARD TO DECK
			$cardList.delegate('.card:not(.greyCard)', "click", function() {
				addCard(curDeck, $( this ));
			});
			// REMOVE CARD FROM DECK
			$cardScroller.delegate('.deckCard', "click", function() {
				removeCard(curDeck, $( this ));
			});

			// REBIND BACK BUTTON
			$backButton.one("click.deck", function() {

				let l = 0;
				for(let i=0; i<curDeck.deckCards.length; i++) {
					l += curDeck.deckCards[i].num;
				}

				if (l == 30) {

					var newName = $deckButton.children( '.deckName' ).val();

					$.get(
						"/php/createNewDeck.php",
						{
							"pid": window.localStorage.getItem('PlayerID'),
							"fid": fid,
							"name": newName
						},
						function( data ) {

							var newDID = data;
							curDeck.DID = newDID;
							curDeck.name = newName;

							var toSend = [];
							for(let i=0; i<curDeck.deckCards.length; i++) {
								toSend.push([curDeck.deckCards[i].CID, curDeck.deckCards[i].num]);
							}

							$.post(
								"/php/defineNewDeck.php",
								{ 
									"did": newDID,
									"cards": toSend
								}
							);
						}
					);

					var animHideList = $.chain(function() {

						// REMOVE EVENT LISTENERS
						$cardList.undelegate('.card:not(.greyCard)', "click");
						$cardScroller.undelegate('.deckCard', "click");

						// RETURN COLORS
						setCardNumbers(false);

						// CANCELLING FILTERS
						filterCardsByFaction(0);
						$( '#fracButtonsHolder' ).delegate('.fracButton', "click.APfilter", function() {
							filterCardsByFaction($( this ).attr('value'));
						});
						$( '#fracButtonsHolder' ).children( '.greyCard').removeClass('greyCard');

						return $cardScroller.animate(
							{
								top: -$cardScroller.height()
							},
							{
								duration: dur,
								easing: 'linear'
							}
						);
					}, function() {

						// DELETE CARDS
						$cardScroller.css('display', 'none');

						$cardScroller.children().each(function( index, element ) {
							$( element ).remove();
						});

						$deckScroller.css('display', 'block');
						adjustScroller($deckScroller);

						var durDeck = dur*60/(deckScrollerHeight+(topOffset-index*60)-40);
						
						$deckButton.delay(200+durDeck).animate(
							{
								top: 60,
							},
							{
								duration: durDeck,
								easing: 'linear',
								progress: function( anim, pr ) {
									$deckButton.css({
										'transform': 'scale('+(1-pr/10)+', '+(1-pr/10)+')',
										'-ms-transform': 'scale('+(1-pr/10)+', '+(1-pr/10)+')',
										'-webkit-transform': 'scale('+(1-pr/10)+', '+(1-pr/10)+')',
									});
								},
								complete: function() {
									$deckButton.detach();
									$deckButton.insertBefore($newDeck);
								}
							}
						);
						return $deckScroller.delay(200).animate(
							{
								top: 0
							},
							{
								duration: dur,
								easing: 'linear',
							}
						);
					});
					$.when( animHideList ).done(function() {

						var text = $deckButton.children( '.deckName' ).val();
						$deckButton.children( '.deckName' ).remove();
						$deckButton.append('<span class="deckName">'+text+'</span>');
						$deckButton.children( '#deckInfo' ).remove();

						data.decks.push(curDeck);

						$newDeck.fadeIn({
							duration: 200,
							easing: 'linear'
						});

						// RETURN BUTTON FUNCTIONALITY
						$backButton.on("click.menu", function() {
							$( '#mainMenu' ).animate(
								{
									'margin-left': '0'
								},
								{
									duration: 500
								}
							);
						});
					});
				} else {
					alert('the deck is unfinished');
				}
			});

		});
	});
	
	// LIST CARDS IN THE DECK
	$deckScroller.delegate('.deckButton', "click", function() {

		var index = $deckScroller.children( '.deckButton' ).index( this );
		var curDeck = data.decks[index];

		$backButton.off("click.menu");

		// FILTERING CARDS
		filterCardsByFaction(curDeck.FID);
		$( '#fracButtonsHolder' ).undelegate('.fracButton', "click.APfilter");
		$( '#fracButtonsHolder' ).children( ':not([value="'+curDeck.FID+'"])').addClass('greyCard');

		// CREATING CARD LIST
		$cardScroller.css('display', 'block');
		$cardScroller.append(deckListGenerator(data.decks[index]));
		$cardScroller.css({
			'top': -$cardScroller.height(),
			'display': 'none'
		});

		// ADJUST SCROLLER
		adjustScroller($cardScroller);

		// SHOW CARDS BELONGING TO THE DECK
		setCardNumbers(curDeck);

		// CLONE DECK BUTTON
		var $curButton = $( this );
		var topOffset = $curButton.offset().top;
		$curButton.clone().appendTo($deckList);

		var $cloneButton = $deckList.children( '.deckButton' );

		$cloneButton.css('top', topOffset);
		var text = $cloneButton.children( '.deckName' ).text();
		$cloneButton.children( '.deckName' ).remove();
		$cloneButton.append('<input type="text" class="deckName" value="'+text+'">');

		// PLACE DECK INFO
		$cloneButton.append(deckInfo);
		adjustInfo(curDeck);

		// COUNTING TIME FOR ANIMATIONS
		var durClone = dur*topOffset/(deckScrollerHeight+(topOffset-index*60)-40);

		// ANIMATING LISTS
		var animShowList = $.chain(function() {
			$cloneButton.animate(
				{
					top: 0
				},
				{
					duration: durClone,
					easing: 'linear',
					progress: function( anim, pr ) {
						$cloneButton.css('transform', 'scale('+(.9+pr/10)+', '+(.9+pr/10)+')');
					}
				}
			);
			return $deckScroller.animate(
				{
					top: -deckScrollerHeight
				},
				{
					duration: dur,
					easing: 'linear'
				}
			);
		}, function() {
			$deckScroller.css('display', 'none');
			$cardScroller.css('display', 'block');

			return $cardScroller.delay(200).animate(
						{
							top: 0
						},
						{
							duration: dur,
							easing: 'linear'
						}
					);
		});

		// LAUNCH MAIN FUNCTIONALITY
		$.when( animShowList ).done(function() {

			// ADD CARD TO DECK
			$cardList.delegate('.card:not(.greyCard)', "click", function() {
				addCard(curDeck, $( this ));
			});
			// REMOVE CARD FROM DECK
			$cardScroller.delegate('.deckCard', "click", function() {
				removeCard(curDeck, $( this ));
			});

			// REBIND BACK BUTTON
			$backButton.one("click.deck", function() {

				let l = 0;
				for(let i=0; i<curDeck.deckCards.length; i++) {
					l += curDeck.deckCards[i].num;
				}

				if (l == 30) {
					var animHideList = $.chain(function() {

						var toSend = [];
						for(let i=0; i<curDeck.deckCards.length; i++) {
							toSend.push([curDeck.deckCards[i].CID, curDeck.deckCards[i].num]);
						}

						var newName = $cloneButton.children( '.deckName' ).val();

						$curButton.children( '.deckName' ).text(newName);
						curDeck.name = newName;

						$.post(
							"/php/updateDeck.php",
							{
								"did": curDeck.DID,
								"name": newName,
								"cards": toSend
							}
						);

						// REMOVE EVENT LISTENERS
						$cardList.undelegate('.card:not(.greyCard)', "click");
						$cardScroller.undelegate('.deckCard', "click");

						// RETURN COLORS
						setCardNumbers(false);

						// CANCELLING FILTERS
						filterCardsByFaction(0);
						$( '#fracButtonsHolder' ).delegate('.fracButton', "click.APfilter", function() {
							filterCardsByFaction($( this ).attr('value'));
						});
						$( '#fracButtonsHolder' ).children( '.greyCard').removeClass('greyCard');

						return $cardScroller.animate(
							{
								top: -$cardScroller.height()
							},
							{
								duration: dur,
								easing: 'linear'
							}
						);
					}, function() {

						// DELETE CARDS
						$cardScroller.css('display', 'none');

						$cardScroller.children().each(function( index, element ) {
							$( element ).remove();
						});

						$deckScroller.css('display', 'block');
						adjustScroller($deckScroller);

						$deckScroller.delay(200).animate(
							{
								top: 0
							},
							{
								duration: dur,
								easing: 'linear'
							}
						);
						return $cloneButton.delay(200+dur-durClone).animate(
							{
								top: topOffset,
							},
							{
								duration: durClone,
								easing: 'linear',
								progress: function( anim, pr ) {
									$cloneButton.css('transform', 'scale('+(1-pr/10)+', '+(1-pr/10)+')');
								}
							}
						);
					});
					$.when( animHideList ).done(function() {

						$cloneButton.remove();

						// RETURN BUTTON FUNCTIONALITY
						$backButton.on("click.menu", function() {
							$( '#mainMenu' ).animate(
								{
									'margin-left': '0'
								},
								{
									duration: 500
								}
							);
						});
					});
				} else {
					alert('the deck is unfinished');
				}
			});

		});
	});
}

// MAGIC STARTS HERE
if (window.localStorage.getItem('PlayerID')*1 != -1) {
	
	$.preloadImages("img/allCards.jpg","img/allCovers.jpg","img/paper-texture.jpg");

	$.get(
		"/php/getCardsAndDecksByPID.php",
		{
			"pid": window.localStorage.getItem('PlayerID')*1
		},
		function( data ) {
			data = JSON.parse(data);

			// GREETINGS
			$( '#menuButtons>span' ).text("Welcome, " + window.localStorage.getItem('PlayerName') + "!");

			// ATTACHING BUTTON EVENTS
			$( '#openDeck' ).on('click', function() {
				$( '#mainMenu' ).stop().animate(
					{
						'margin-left': '-100%'
					},
					{
						duration: 500,
						easing: 'linear'
					}
				);
			});
			$( '#openGame' ).on('click', function() {

				$chooseDeckForGame.css("display", "block");
				$chooseDeckForGame.append(deckButtonsGenerator(data.decks));

				$chooseDeckForGame.delegate('.deckButton', 'click', function( event ){
					window.localStorage.setItem('ChosenDeckID', $( this ).attr("data-did"));
					window.location.replace("http://dbproj.kz/game.html");
				});
			});
			$( '#logOut' ).on('click', function() {
				window.localStorage.setItem('PlayerID', -1);
				window.location.replace("http://dbproj.kz/login.html");
			});

			main( data );
		}
	);
} else {
	alert("You need to log in to proceed!");
	window.location.replace("http://dbproj.kz/login.html");
}