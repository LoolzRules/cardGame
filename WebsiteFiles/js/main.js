const cardWidth = 100;
const cardHeight = 150;
const arrowDiv = '<div id="arrow"><div></div><div></div></div>';
const fireDiv = '<div id="fireOut"><div id="fireIn"></div></div>';
const mullDiv = '<div id="mulligan"><div></div><button>Confirm</button></div>';
const mullCross = '<div class="mullCross"></div>';
const placeholder = '<div class="card placeholder"></div>';
const hitDiv = '<div class="hit"><span></span></div>';
const ropeDiv = '<div id="rope"></div>';

// card arrays
var mDeck = [];
var eDeck = [];
var mTable = [];
var eTable = [];
var mHand = [];
var eHand = [];

var eToAppend;
var mToAppend;

// mulligan helper
var mullCount = 0;

// action points
var mAp = 0;
var eAp = 0;
var mHero = { HP: 30 }
var eHero = { HP: 30 }

// turn counters
var mTurn = 0;
var eTurn = 0;

// TEMP FUNCTION
function showArrays() {
	console.log('mHand:\n'+JSON.stringify(mHand)+'\n');
	console.log('mDeck:\n'+JSON.stringify(mDeck)+'\n');
	console.log('mTable:\n'+JSON.stringify(mTable)+'\n');
	console.log('eHand:\n'+JSON.stringify(eHand)+'\n');
	console.log('eDeck:\n'+JSON.stringify(eDeck)+'\n');
	console.log('eTable:\n'+JSON.stringify(eTable)+'\n');
}

// ALIGN CARDS IN GIVEN PARENT (no card overlapping)
function alignAtStart( obj, delay ) {
	if (typeof delay === "undefined") {
		delay = 0;
	}
	var children = obj.children();
	var temp;

	if (children.length == 1) {
		temp = obj.width() - cardWidth;
	} else {
		temp = obj.width() - cardWidth*(children.length-1);
	}

	children.first().animate(
		{
			'width': temp/2
		},
		{
			duration: delay,
			easing: 'easeOutExpo'
		}
	);
}
// ALIGN CARDS IN GIVEN PARENT
function align( parent, firstChild, delay, onRemove, removedIndex ) {

	if (typeof delay === "undefined") {
		delay = 2000;
	}

	var helperWidth;

	if(parent.children().length == 2) {
		helperWidth = (parent.width() - cardWidth)/2;
		firstChild.animate(
			{
				'width': helperWidth
			},
			{
				duration: delay,
				easing: 'easeOutExpo'
			}
		);
		return [helperWidth, helperWidth];

	} else {

		var index;
		if (typeof onRemove === "undefined") {
			onRemove = false;
		}
		if (typeof removedIndex === "undefined" || removedIndex+1 == parent.children().length) {
			index = false;
		} else {
			index = removedIndex+1;
		}

		var cardShiftLeft;
		var moveBy = (parent.width() - (parent.children().length-1)*cardWidth);

		if (moveBy < 0) {
			helperWidth = moveBy / (parent.children().length - 2);
			cardShiftLeft = parent.width() - cardWidth;
			firstChild.animate(
				{
					'width': 0
				},
				{
					duration: delay,
					easing: 'easeOutExpo'
				}
			);

			if (onRemove) {
				if (index) {
					parent.children().eq(index).css('margin-left', cardWidth + helperWidth-.2);
				}
				parent.children(':not(:first):not(:nth-child(2))').each(function() {
					$( this ).animate(
						{
							'margin-left': helperWidth-.2
						},
						{
							duration: delay,
							easing: 'easeOutExpo'
						}
					);
				});
			} else {
				parent.children(':not(:last):not(:first):not(:nth-child(2))').each(function(){
					$( this ).animate(
						{
							'margin-left': helperWidth
						},
						{
							duration: delay,
							easing: 'easeOutExpo'
						}
					);
				});
			}
		} else {
			helperWidth = moveBy / 2;
			cardShiftLeft = (parent.children().length - 2)*cardWidth + helperWidth;
			firstChild.animate(
				{
					'width': helperWidth
				},
				{
					duration: delay,
					easing: 'easeOutExpo'
				}
			);

			if (onRemove) {
				if (index) {
					parent.children().eq(index).css('margin-left', cardWidth);
				}
				parent.children(':not(:first)').each(function() {
					$( this ).animate(
						{
							'margin-left': 0
						},
						{
							duration: delay,
							easing: 'easeOutExpo'
						}
					);
				});
			}
		}

		return [cardShiftLeft, helperWidth];
	}
}



// REFRESH AP
function apRefresh( bool ) {
	if (bool) {
		// My action points reset
		mTurn++;
		mAp = (mTurn>10) ? 10:mTurn;
		for(let i = 0; i<mAp; i++) {
			$( '#myActionPoints' ).children().eq(i).addClass('apOn');
		}
		// Remove residual enemy AP
		for(let i = 0; i<eAp; i++) {
			$( '#enemyActionPoints' ).children().eq(i).removeClass('apOn');
		}
	} else {
		// Enemy action points reset
		eTurn++;
		eAp = (eTurn>10) ? 10:eTurn;
		for(let i = 0; i<eAp; i++) {
			$( '#enemyActionPoints' ).children().eq(i).addClass('apOn');
		}
		// Remove residual enemy AP
		for(let i = 0; i<mAp; i++) {
			$( '#myActionPoints' ).children().eq(i).removeClass('apOn');
		}
	}
}



// TIMER
// TODO - emit event so that player would not be able to put card after finish turn
function timer() {

	var id = setTimeout(function() {
		
		$( '#finishButton' ).off('click.timerBeforeRope');

		$( '#ropeOuter' ).append(ropeDiv);
		var rope = $( '#rope' );
		rope.css('width', $( '#ropeOuter' ).width());
		rope.animate(
			{
				width: 0
			},
			{
				duration: 50000,
				easing: 'linear',
				complete: finishTurn
			}
		);

		$( '#finishButton' ).one('click.timerOnRope', function() {
			$( '#rope' ).finish();
		});

	}, 50000);

	$( '#finishButton' ).one('click.timerBeforeRope', function() {
		clearTimeout(id);
		finishTurn();
	});
}



// GENERATE CARDS AND THEIR 'CHIPS'
function cardGenerator( card, fid ) {
	var faction;
	if (fid == 1) {
		faction = 'war';
	} else if (fid == 2) {
		faction = 'sci';
	} else {
		faction = 'art';
	}
	
	return '<div class="card ' + faction + '" data-ap="' + card.AP + '"'
			+ ' data-cid="'+ card.CID + '">'
			+ '<span class="cardAP">' + card.AP + '</span>'
			+ '<div class="portrait" style="background-position:' + card.cX*100/59 + '%;"></div>'
			+ '<div class="cardName"><span class="cardName">' + card.name + '</span></div>'
			+ '<div class="cardDesc"><span class="cardDesc">' + card.description + '</span></div>'
			+ '<span class="cardHP">' + card.HP + '</span>'
			+ '<span class="cardDP">' + card.DP + '</span>'
			+ '</div>';
}

function chipGenerator( card ) {
	return	'<div class="tablePortrait" data-cid="'+ card.CID + '" style="background-position:' + card.cX*100/59 + '%;">'
			+ '<span class="cardHP">' + card.HP + '</span>'
			+ '<span class="cardDP">' + card.DP + '</span>'
			+ '</div>';
}

function coverGenerator( fid ) {
	return '<div class="card cover" data-fid="' + fid + '""></div>';
}


// SHUFFLE ARRAY
function shuffle( arr ) {
    var j, x, i;
    for (i = arr.length; i>0; i--) {
        j = Math.floor(Math.random() * i) % arr.length;
        x = arr[i - 1];
        arr[i - 1] = arr[j];
        arr[j] = x;
    }
}



// RENDER AN ANIMATION
function render( div, fps, xSize, ySize, frPerRow, frPerCol, time ) {
	var interval = 1000/fps;
	var frameWidth = xSize/frPerRow;
	var frameHeight = ySize/frPerCol;
	var x = 0;
	var y = 0;
	var id = setInterval(function() {
		div.css('background-position', x + 'px ' + y + 'px');
		x = (x-frameWidth) % xSize;
		if (x==0) {
			y = (y-frameHeight) % ySize;
		}
	}, interval);
	setTimeout(function() { return clearInterval(id); }, time);
}



// DESIDES WHICH CARDS CAN BE PLAYED
function canBePlayed() {
	$( '#myHand' ).children( '.card' ).each( function( index, element ) {
		if(mHand[index].AP > mAp || mTable.length>=7) {
			$( element ).removeClass('putMe');
		} else {
			$( element ).addClass('putMe');
		}
	});

	$( '#myHand' ).sortable('refresh');
}



// HIT DEFENDER WITH ATTACKER
function hit( attacker, defender ) {

	/*
	$( '#myTable>.putMe' ).each(function( element, index ) {
		$( element ).removeClass('playable');
		setTimeout(function() {
			$( element ).addClass('playable');
		}, 1250);
	});
	*/

	var aIndex;
	var dIndex;

	attacker.parent().children().each( function( index, element ) {
		if ($( element ).is(attacker)) {
			aIndex = index-1;
		}
	});

	defender.parent().children().each( function( index, element ) {
		if ($( element ).is(defender)) {
			dIndex = index-1;
		}
	});


	attacker.css('z-index', 1000);
	attacker.animate(
		{
			left: defender.offset().left - attacker.offset().left,
			top: defender.offset().top - attacker.offset().top
		},
		{
			duration: 500,
			easing: 'easeInOutExpo',
			complete: function() {

				// Add hit splash
				attacker.append(hitDiv);
				defender.append(hitDiv);

				// Remove hit splash
				attacker.children().last().delay(1000).fadeOut({
					duration: 1000,
					easing: 'easeOutExpo',
					complete: function() {
						attacker.children().last().remove();
					}
				});
				defender.children().last().delay(1000).fadeOut({
					duration: 1000,
					easing: 'easeOutExpo',
					complete: function() {
						defender.children().last().remove();
					}
				});

				var aHP = attacker.children( '.cardHP' ).first();
				var dHP = defender.children( '.cardHP' ).first();


				if( attacker.parent().is( $( '#myTable' ) ) ) {
					attacker.children().last().children().last().text('-' + eTable[dIndex].DP);
					defender.children().last().children().last().text('-' + mTable[aIndex].DP);

					mTable[aIndex].HP -= eTable[dIndex].DP;
					eTable[dIndex].HP -= mTable[aIndex].DP;

					aHP.text(mTable[aIndex].HP);
					dHP.text(eTable[dIndex].HP);

				} else {
					attacker.children().last().children().last().text('-' + mTable[dIndex].DP);
					defender.children().last().children().last().text('-' + eTable[aIndex].DP);

					eTable[aIndex].HP -= mTable[dIndex].DP;
					mTable[dIndex].HP -= eTable[aIndex].DP;

					aHP.text(eTable[aIndex].HP);
					dHP.text(mTable[dIndex].HP);
				}

			}
		}
	).animate(
		{
			left: 0,
			top: 0
		},
		{
			duration: 750,
			easing: 'easeOutExpo',
			complete: function() {
				attacker.css('z-index', "");

				if( attacker.parent().is( $( '#myTable' ) ) ) {
					if (mTable[aIndex].HP <= 0) {
						mTable.splice(aIndex, 1);
						$( '#myTable' ).children().eq(aIndex+1).remove();
						alignAtStart($( '#myTable' ), 100);
					}
					if (eTable[dIndex].HP <= 0) {
						eTable.splice(dIndex, 1);
						$( '#enemyTable' ).children().eq(dIndex+1).remove();
						alignAtStart($( '#enemyTable' ), 100);
					}
				} else {
					if (mTable[dIndex].HP <= 0) {
						mTable.splice(dIndex, 1);
						$( '#myTable' ).children().eq(dIndex+1).remove();
						alignAtStart($( '#myTable' ), 100);
					}
					if (eTable[aIndex].HP <= 0) {
						eTable.splice(aIndex, 1);
						$( '#enemyTable' ).children().eq(aIndex+1).remove();
						alignAtStart($( '#enemyTable' ), 100);
					}
				}
			}
		}
	);
}

function hitFace( attacker, targetIsEnemy ) {
	var $target;
	var aIndex;
	if (targetIsEnemy) {
		$target = $( '#enemyHero' );
	} else {
		$target = $( '#myHero' );
	}

	attacker.parent().children().each( function( index, element ) {
		if ($( element ).is(attacker)) {
			aIndex = index-1;
		}
	});

	attacker.css('z-index', 1000);
	attacker.animate(
		{
			left: $target.offset().left - attacker.offset().left,
			top: $target.offset().top - attacker.offset().top
		},
		{
			duration: 500,
			easing: 'easeInOutExpo',
			complete: function() {
				// Add hit splash
				$target.append(hitDiv);

				$target.children().last().delay(1000).fadeOut({
					duration: 1000,
					easing: 'easeOutExpo',
					complete: function() {
						$target.children().last().remove();
					}
				});

				var $tHP = $target.children( '.heroHP' ).first();

				if( targetIsEnemy ) {
					$target.children().last().children().last().text('-' + mTable[aIndex].DP);

					eHero.HP -= mTable[aIndex].DP;
					$tHP.text(eHero.HP);

					// WINNING CONDITION
					if(eHero.HP <= 0) {
						alert("You WON");
						$.post(
							"/php/changeRating.php",
							{
								"pid": window.localStorage.getItem('PlayerID'),
								"result": 1
							}
						);
						window.location.replace("http://dbproj.kz/menu.html");
					}

				} else {
					$target.children().last().children().last().text('-' + eTable[aIndex].DP);

					mHero.HP -= eTable[aIndex].DP;
					$tHP.text(mHero.HP);

					// LOSING CONDITION
					if(mHero.HP <= 0) {
						alert("You LOST");
						$.post(
							"/php/changeRating.php",
							{
								"pid": window.localStorage.getItem('PlayerID'),
								"result": 0
							}
						);
						window.location.replace("http://dbproj.kz/menu.html");
					}
				}

			}
		}
	).animate(
		{
			left: 0,
			top: 0
		},
		{
			duration: 750,
			easing: 'easeOutExpo',
			complete: function() {
				attacker.css('z-index', "");
			}
		}
	);
}



// BURN THE CARD
function burnCard( my ) {
	var table = $( '#table' );
	var deck;

	if (my) {
		mDeck.splice(0, 1);
		deck = $( '#myDeck' );
	} else {
		eDeck.splice(0, 1);
		deck = $( '#enemyDeck' );
	}

	var cover = deck.children().last();
	cover.attr('id', 'burningCover');

	var b1 = {
		'left': table.offset().left + (table.width() - cardWidth)/2 - cover.offset().left,
		'top': table.offset().top + (table.height() - cardHeight)/2 - cover.offset().top
	};

	cover.animate(
		{
			top: b1.top,
			left: b1.left,
		},
		{
			duration: 1500,
			easing: 'easeOutExpo',
			complete: function() {
				cover.css('background-size', '600% auto');
				cover.append(fireDiv);
				cover.append(fireDiv);
				render(cover.children().first().children().first(), 40, 512, 512, 8, 4, 1500);
				render(cover.children().first().children().last(), 40, 512, 512, 8, 4, 1500);
			}
		}
	).animate(
		{
			height: 0
		},
		{
			duration: 1500,
			easing: 'linear',
			complete: function() {
				cover.remove();
			}
		}	
	);
}

// FROM MY DECK TO MY HAND
function myDeck_myHand( deckCard ) {

	if ( $( '#myDeck' ).children().length > 0 ) {

		if ($( '#myHand' ).children().length > 10) {
			return burnCard( true );
		}

		var source = $( '#myDeck' ).children().last();
		var table = $( '#table' );

		// Calculate main waypoints
		var a = source.offset();
		var b1 = {
			'left': (table.offset().left + table.width()/2 - cardWidth),
			'top': (table.offset().top + table.height()/2 - cardHeight)
		};
		var b0 = {
			'left': (b1.left + a.left)/2,
			'top': (b1.top + a.top)/2
		};

		source.animate(
			{
				left: b0.left - a.left,
				top: b0.top - a.top,
				height: 3*cardHeight/2,
				width: 1
			},
			{
				duration: 1000,
				easing: 'easeInExpo',
				complete: function() {

					var parentDiv = $( '#myHand' );
					parentDiv.append( cardGenerator(deckCard, myFID) );
					mHand.push(deckCard);

					// Remove cover
					source.remove();

					// Calculate margin and new card coordinates
					var temp = align(parentDiv, parentDiv.children().first());
					var cardShiftLeft = temp[0];
					var margin = temp[1];

					// Place card at the same place
					var card = parentDiv.children().last();
					card.css({
						'position': 'absolute',
						'height': 3*cardHeight/2,
						'width': 3*cardWidth/2,
						'transform': 'scaleX(0)',
						'left': b0.left - parentDiv.offset().left,
						'top': b0.top - parentDiv.offset().top,
						'font-size': '15px'
					});

					card.animate(
						{
							left: b1.left - parentDiv.offset().left,
							top: b1.top - parentDiv.offset().top,
							height: cardHeight*2,
							width: cardWidth*2,
							'font-size': '20px'
						},
						{
							duration: 800,
							easing: 'easeOutExpo',
							progress: function( anim, progress ) {
								card.css('transform', 'scaleX('+  (1 - Math.pow( 2, -10 * progress )) + ')');
							}
						}
					).animate(
						{
							left: cardShiftLeft,
							top: 0,
							height: cardHeight,
							width: cardWidth,
							'font-size': '10px'
						},
						{
							duration: 1200,
							easing: 'easeInExpo',
							complete: function() {
								card.removeAttr('style');
								if (margin<0 || parentDiv.children().length == 1) {
									card.css('margin-left', margin-.5);
								}
								canBePlayed();
								timer();
							}
						}
					);
				}
				
			}
		);


	} else {
		// HIT MY HERO
	}
}
// FROM ENEMY DECK TO HAND
function enemyDeck_enemyHand() {

	if ($( '#enemyDeck' ).children().length > 0) {

		eHand.push(eDeck[0]);
		eDeck.splice(0, 1);

		if ($( '#enemyHand' ).children().length > 10) {
			return burnCard();
		}
		
		var target = $( '#enemyHand' );
		var source = $( '#enemyDeck' );
		var card = source.children().last();

		card.css({
			'z-index': '99',
			'box-shadow': 'none',
			'top': card.offset().top - card.css('margin').replace('px', '')*1 + 50,
			'left': card.offset().left - target.offset().left - card.css('margin').replace('px', '')*1,
			'position': 'absolute'
		});

		card.appendTo('#enemyHand');

		var temp = align(target, target.children().first());
		var cardShiftLeft = temp[0];
		var margin = temp[1];

		card.animate(
			{
				left: cardShiftLeft,
				top: -50,
				margin: 0
			},
			{
				duration: 2000,
				easing: 'easeInOutExpo',
				complete: function() {
					card.removeAttr('style');
					if (margin<0 || target.children().length == 1) {
						card.css('margin-left', margin-1);
					}
				}
			}
		);


	}
}



// FROM ENEMY HAND TO TABLE
// card - card to be inserted
// cardInHand = index of cover in hand, 
// cardOnTable = index of card on table after which new card should be inserted. if -1, new card shoulde be the first
function enemyHand_enemyTable( card, cardInHand, cardOnTable ) {

	for (let i=0; i<card.AP; i++) {
		$( '#enemyActionPoints' ).children().eq(eAp-1).removeClass('apOn');
		eAp--;
	}
	
	var table = $( '#enemyTable' );
	var hand = $( '#enemyHand' );
	var cover = hand.children().eq(cardInHand+1);
	var moveTo;
	var length = table.children().length;
	var complFunc;

	if (length == 1) {
		moveTo = (table.width()-cardWidth)/2 - cover.offset().left + table.offset().left;

		complFunc = function() {
					table.append( chipGenerator(card) );
					table.children().first().css('width', (cover.offset().left - table.offset().left));
					eTable.push(card);
				}

	} else {
		var helperOnTable = table.children().first();
		if (cardOnTable == -1) {
			moveTo = (table.width() - cardWidth*length)/2 - cover.offset().left + table.offset().left;

			helperOnTable.animate(
				{
					'width': (table.width() - cardWidth*(length-2))/2,
				},
				{
					duration: 1000,
					easing: 'easeOutExpo'
				}
			);

			complFunc = function() {
						helperOnTable.after( chipGenerator(card) );
						helperOnTable.css('width', '-=100');
						eTable.splice(0, 0, card);
					}

		} else if (cardOnTable >= length - 2) {
			moveTo = (table.width() + cardWidth*(length-2))/2 - cover.offset().left + table.offset().left;

			helperOnTable.animate(
				{
					'width': (table.width() - cardWidth*(length))/2,
				},
				{
					duration: 1000,
					easing: 'easeOutExpo'
				}
			);

			complFunc = function() {
						table.append( chipGenerator(card) );
						eTable.push(card);
					}

		} else {
			moveTo = (table.width() - cardWidth*(length-2-cardOnTable*2))/2 - cover.offset().left + table.offset().left;
			var nextCard = table.children().eq(cardOnTable+2);

			helperOnTable.animate(
				{
					'width': (table.width() - cardWidth*(length))/2,
				},
				{
					duration: 1000,
					easing: 'easeOutExpo'
				}
			);

			nextCard.animate(
				{
					'margin-left': cardWidth,
				},
				{
					duration: 1000,
					easing: 'easeOutExpo'
				}
			);

			complFunc = function() {
						nextCard.before( chipGenerator(card) );
						nextCard.css('margin-left', "");
						eTable.splice(cardOnTable+1, 0, card);
					}
		}
	}

	cover.animate(
		{
			left: moveTo,
			top: table.offset().top,
			'margin-top': 0
		},
		{
			duration: 1000,
			easing: 'easeOutExpo',
			complete: complFunc
		}
	).fadeOut(
		{
			duration: 1000,
			easing: 'easeOutExpo',
			complete: function() {
				cover.remove();
				align(hand, hand.children().first(), 1000, true, cardInHand);
			}
		}
	);
}



// FUNCTION THAT RUNS BETWEEN YOUR TURNS
function finishTurn() {
	//console.log('my hand:\n' + JSON.stringify(mHand) + '\n');
	//console.log('my table:\n' + JSON.stringify(mTable) + '\n');
	//console.log('enemy table:\n' + JSON.stringify(eTable) + '\n');

	// Make all cards on table unplayable
	$( '#myTable' ).children( '.tablePortrait' ).each(function( index, element ) {
		$( element ).removeClass('playable');
	});

	$( '#myHand' ).children( '.card' ).each(function( index, element ) {
		$( element ).removeClass('putMe');
	});

	apRefresh(false);

	setTimeout( function() {

		setTimeout( function() {

			var delay;

			if ( $( '#enemyTable' ).children( '.tablePortrait' ).length > 0) {
				$( '#enemyTable' ).children( '.tablePortrait' ).each(function( index, element ) {
					setTimeout(function(){
						if ($( '#myTable' ).children( '.tablePortrait' ).length > 0){
							hit( $( element ), $( '#myTable' ).children().eq(1) );
						} else {
							hitFace( $( element ), false );
						}
						delay = index*2000;
					}, index*2000);
				});
			}
	
			setTimeout( function() {

				apRefresh(true);

				// Make all cards on table playable
				$( '#myTable' ).children( '.tablePortrait' ).each(function( index, element ) {
					$( element ).addClass('playable');
				});

				myDeck_myHand(mDeck[0]);
				mDeck.splice(0, 1);

			}, delay+1500);

		}, 1000);

		if (eTable.length < 7 && eHand.length > 0) {
			/*var remainingAP = eAp;
			var toPut = [];
			for (let i = 0; i<eHand.length && remainingAP>0; i++) {
				if(eHand[i].AP<remainingAP) {
					toPut.push(i);
					remainingAP -= eHand[i].AP;
				}
			}
			if (toPut.length>0) {
				for (let i=0; i<toPut.length; i++) {
					setTimeout(function(){
						var eCard = eHand[toPut[i]];
						eHand.splice(toPut[i], 1);
						return enemyHand_enemyTable(eCard, toPut[i], 0);
					}, i*2000);
				}
			*/
			for (var i = 0; i<eHand.length; i++) {
				if(eHand[i].AP<eAp) {
					break;
				}
			}
			if (i<eHand.length) {
				var eCard = eHand[i];
				eHand.splice(i, 1);
				return enemyHand_enemyTable(eCard, i, 0);
			} else {
				return null;
			}
			
		} else {
			return null;
		}

	}, 2000);

	return enemyDeck_enemyHand();
}



// MULLIGAN HELPER - REPLACES UNWANTED CARDS
function replaceMe( elem, ind ) {
	var card = $( elem );
	var deck = $( '#myDeck' );
	var vector = {
		'left': deck.offset().left - card.offset().left,
		'top': deck.offset().top - card.offset().top
	}
	var dur = Math.sqrt(vector.left*vector.left + vector.top*vector.top);

	card.animate(
		{
			top: vector.top/2,
			left: vector.left/2,
			'font-size': '15px',
			width: 3*cardWidth/2,
			height: 3*cardHeight/2,
			'margin-right': cardWidth/2
		},
		{
			duration: 500+dur,
			easing: 'easeInExpo',
			progress: function( anim, progress ) {
				card.css('transform', 'scaleX('+  (Math.pow( 2, -10 * progress )) + ')');
			},
			complete: function() {

				deck.append(mToAppend);
				var cover = deck.children().last();
				var coords = {
					'left': card.offset().left - deck.offset().left,
					'top': card.offset().top - deck.offset().top
				}

				cover.css({
					'left': coords.left,
					'top': coords.top,
					'width': 1,
					'height': 3*cardHeight/2,
					'z-index': 1000
				});

				var holder = placeholder.replace('er"', 'er" id="p' + ind + '"');
				card.after(holder);
				holder = $( '#p'+ind );
				holder.css('margin-left', (ind==0) ? 0:20);

				card.remove();

				cover.animate(
					{
						width: cardWidth,
						height: cardHeight,
						top: 0,
						left: 0
					},
					{
						duration: 500+dur,
						easing: 'easeOutExpo'
					}
				).animate(
					{
						width: 1,
						height: 3*cardHeight/2,
						top: coords.top,
						left: coords.left
					},
					{
						duration: 500,
						easing: 'easeInExpo',
						complete: function() {
							var parentDiv = $( '#mulligan>div:first-child' );
							holder.after( cardGenerator(mDeck[mDeck.length - 1 - ind], myFID) );
							// Track cards in hand
							mHand.splice(ind, 1, mDeck[mDeck.length - 1 - ind]);
							mDeck[mDeck.length - 1 - ind] = 'azaza';

							var coords = {
								'left': cover.offset().left - parentDiv.offset().left,
								'top': cover.offset().top - parentDiv.offset().top
							}
							cover.remove();

							// Place card at the same spot
							var newCard = parentDiv.children().eq(ind+1);
							newCard.css({
								'position': 'absolute',
								'height': 3*cardHeight/2,
								'width': 3*cardWidth/2,
								'transform': 'scaleX(0)',
								'left': coords.left,
								'top': coords.top,
								'font-size': '15px'
							});

							newCard.animate(
								{
									left: ind*(cardWidth*2 + 20),
									top: 0,
									height: cardHeight*2,
									width: cardWidth*2,
									'font-size': '20px'
								},
								{
									duration: 500,
									easing: 'easeOutExpo',
									progress: function( anim, progress ) {
										newCard.css('transform', 'scaleX('+  (1 - Math.pow( 2, -10 * progress )) + ')');
									},
									complete: function() {
										newCard.removeAttr('style');
										newCard.css({
											'position': 'relative',
											'margin-left': (ind==0) ? 0:20
										});
										holder.remove();
										mullCount++;
									}
								}
							);
						}
					}
				);
			}
		}
	);
}
// MULLIGAN HELPER - FLIPS CARDS FROM DECK
function flip( cover, shiftRight, ind ) {

	var target = $( '#mulligan' ).children().first();
	var source = $( '#myDeck' );
	var dest = {
		'top': target.offset().top - source.offset().top,
		'left': target.offset().left - source.offset().left + shiftRight
	};
	var dur = Math.sqrt(dest.left*dest.left + dest.top*dest.top);

	cover.css('z-index', 1000);
	cover.delay(ind*1000).animate(
		{
			top: dest.top/2,
			left: dest.left/2,
			width: 0,
			height: 3*cardHeight/2
		},
		{
			duration: dur,
			easing: 'easeInExpo',
			complete: function() {

				var parentDiv = $( '#mulligan>div:first-child' );
				parentDiv.append( cardGenerator(mDeck[ind], myFID) );
				var coords = {
					'left': cover.offset().left - parentDiv.offset().left,
					'top': cover.offset().top - parentDiv.offset().top
				}
				cover.remove();

				// Place card at the same spot
				var card = parentDiv.children().last();
				card.css({
					'position': 'absolute',
					'height': 3*cardHeight/2,
					'width': 3*cardWidth/2,
					'transform': 'scaleX(0)',
					'left': coords.left,
					'top': coords.top,
					'font-size': '15px'
				});

				card.animate(
					{
						left: shiftRight,
						top: 0,
						height: cardHeight*2,
						width: cardWidth*2,
						'font-size': '20px'
					},
					{
						duration: dur,
						easing: 'easeOutExpo',
						progress: function( anim, progress ) {
							card.css('transform', 'scaleX('+  (1 - Math.pow( 2, -10 * progress )) + ')');
						},
						complete: function() {
							card.removeAttr('style');
							card.css({
								'position': 'relative',
								'margin-left': (shiftRight==0) ? 0:20
							});
							card.addClass('unclicked');
						}
					}
				);
			}
		}
	);
}
// MULLIGAN STAGE
function mulligan( numOfCards ) {

	$( 'body' ).append(mullDiv);

	var div = $( '#mulligan>div:first-child' );
	var button = $( '#mulligan>button:last-child' );
	var myDeck = $( '#myDeck' );
	var l = $( '#myDeck' ).children().length;

	if (numOfCards == 3) {
		div.css({
			'width': 640,
			'left': 'calc(50% - 320px)'
		});
	}

	// Flip given number of cards
	for (let i=0; i<numOfCards; i++) {
		flip( $( '#myDeck' ).children().eq(l-1-i), i*(cardWidth*2 + 20), i);
	}

	// Add cross when unclicked card is clicked
	div.delegate('.unclicked', "click.mull", function() {
		var me = $( this );
		me.append(mullCross);
		me.removeClass( 'unclicked' );
		me.addClass( 'clicked' );
	});

	// Remove cross when clicked card is clicked
	div.delegate('.clicked', "click.mull", function() {
		var me = $( this );
		me.children().last().remove();
		me.removeClass( 'clicked' );
		me.addClass( 'unclicked' );
	});

	// Finish by clicking on confirmation button
	button.one("click", function() {
		div.off( '.mull' );
		div.children( '.card' ).each( function( index, element ) {
			// Track cards in hand
			mHand.push(mDeck[index]);

			// Replace each clicked element
			if ( $( element ).hasClass('clicked') ) {
				replaceMe(element, index);
			} else {
				mullCount++;
				$( element ).removeClass( 'unclicked' );
				mDeck[index] = 'azaza';
			}
		});

		// Wait for replacement to end, then put all cards in hand
		var id = setInterval(function() {
			if(mullCount == numOfCards) {
				clearInterval(id);

				$( '#mulligan' ).animate(
					{
						'background-color': 'rgba(0, 0, 0, 0)'
					},
					{
						duration: 500,
						easing: 'linear'
					}
				);

				var myHand = $( '#myHand' );
				//var width = (numOfCards==3) ? (myHand.width() - cardWidth*3)/2 : (myHand.width() - cardWidth*5)/2;

				var width = (myHand.width() - cardWidth*numOfCards)/2;

				$( '#myHand' ).children().first().css('width', width);

				div.children().each( function( index, element ) {
					var card = $( element );
					var dest = {
						'left': width + 2*index*cardWidth + myHand.offset().left - card.offset().left,
						'top': myHand.offset().top - card.offset().top
					}

					card.animate(
						{
							top: dest.top,
							left: dest.left,
							height: cardHeight,
							width: cardWidth,
							'font-size': '10px'
						},
						{
							duration: 500,
							easing: 'easeOutExpo',
							complete: function() {
								card.removeAttr('style');
								card.appendTo(myHand);
								mullCount--;
								if (mullCount==0) {
									$( '#mulligan' ).remove();

									var i = 0;
									while(i<mDeck.length) {
										if (mDeck[i] == 'azaza') {
											mDeck.splice(i, 1);
										} else {
											i++;
										}
									}

									if (numOfCards==4) {

										// APPENDING COIN AND PASSING TURN TO THE ENEMY
										
										/*
										myHand.append( cardGenerator(mDeck[0], myFID) );
										mHand.push(mDeck[0]);
										myHand.children().last().fadeOut(
											{
												duration: 0
											}
										).fadeIn(
											{
												duration: 500,
												easing: 'linear'
											}
										);
										*/

										finishTurn();

									} else {
										apRefresh(true);
										myDeck_myHand( mDeck[0] );
										mDeck.splice(0, 1);
									}
								}
							}
						}
					);
				});
			}
		}, 100);

		// Remove button
		button.fadeOut(
			{
				duration: 500,
				easing: 'linear',
				complete: function() {
					button.remove();
				}
			}
		);
	});
}



// MAIN FUNCTION
function begin() {

	// SET NAMES
	$( '#myNickname' ).append("<span>"+window.localStorage.getItem('PlayerName')+"</span>");
	$( '#enemyNickname' ).append("<span>"+"xX_NAGIBATOR_Xx"+"</span>");

	var lol = Math.random();
	if (lol>.5) {
		lol = 4;
	} else {
		lol = 3;
	}

	// Put n covers to enemy hand
	// var n = (lol==4) ? 3:5;
	var n = 7-lol;

	$( '#myHero' ).attr("data-fid", myFID);
	$( '#enemyHero' ).attr("data-fid", enFID);

	mToAppend = coverGenerator(myFID);
	eToAppend = coverGenerator(enDID);

	for (let i = 0; i<n; i++) {
		$( '#enemyHand' ).append(eToAppend);
		eHand.push(eDeck[0]);
		eDeck.splice(0, 1);
	}
	
	// Put 20 covers to my deck and 20-7+n to the enemy deck
	var shadow = '2px 0px rgba(0,0,0,0.25)';
	for (let i = 0; i<20; i++) {
		if (i < (20-7+n)) {
			$( '#enemyDeck' ).append(eToAppend);
			$( '#enemyDeck' ).children().last().css({
				'-webkit-box-shadow': i + 'px ' + i + 'px ' + shadow,
				'-moz-box-shadow': i + 'px ' + i + 'px ' + shadow,
				'box-shadow': i + 'px ' + i + 'px ' + shadow
			});
		}
		$( '#myDeck' ).append(mToAppend);
		$( '#myDeck' ).children().last().css({
			'-webkit-box-shadow': i + 'px ' + i + 'px ' + shadow,
			'-moz-box-shadow': i + 'px ' + i + 'px ' + shadow,
			'box-shadow': i + 'px ' + i + 'px ' + shadow
		});
	}

	alignAtStart($( '#enemyHand' ), 0);
	alignAtStart($( '#myHand' ), 0);
	alignAtStart($( '#enemyTable' ), 0);
	alignAtStart($( '#myTable' ), 0);

	mulligan(lol);

	// Allows cards to be putted on table from my hand
	// Also refreshes mTable and mHand
	var ind;
	$( '#myHand, #myTable' ).sortable({
		connectWith: '#myTable',
		zIndex: 1000,
		start: function( event, ui ) {
			// Prevents sorting
			$(this).attr('data-sourcelist', ui.item.parent().attr('id'));
			// Finds index
			$( '#myHand' ).children().each( function( index, element ) {
				if( $( element ).is($( ui.helper )) ) {
					ind = index-1;
				}
			});
		},
		change: function( event, ui ) {
			alignAtStart($( '#myTable' ), 100);
		},
		beforeStop: function( event, ui ) {
			$( '#myTable' ).children().each( function( index, element ) {
				if($( element ).hasClass('ui-sortable-placeholder')) {

					mTable.splice(index-2, 0, mHand[ind]);

					// Dealing with ap
					for (let i=0; i<mHand[ind].AP; i++) {
						$( '#myActionPoints' ).children().eq(mAp-1).removeClass('apOn');
						mAp--;
					}
					ui.item.after(chipGenerator(mHand[ind]));
					ui.item.remove();
					mHand.splice(ind, 1);
				}
			});
		},
		stop: function( event, ui ) {
			if($(this).attr('data-sourcelist') === 'myHand' && ui.item.parent().attr('id') === 'myHand') {
				$(this).sortable('cancel');
			} else {
				/*
				ui.item.removeAttr('style');
				ui.item.removeClass('ui-sortable-handle putMe');
				*/
				
				align($( '#myHand' ), $( '#myHand' ).children().first(), 500, true);
				canBePlayed();
			}
		},
		revert: true,
		scroll: false,
		items: '.card, .tablePortrait',
		cancel: '#myHand>.card:not(.putMe), #myTable>.card, .tablePortrait, .helper'
	}).disableSelection();

	// Cards interaction
	$( '#myTable' ).delegate('.playable', "mousedown", function() {

		// Remember event starter and coordinates of its center
		var me = $( this );
		var centerCoords = {
			"left": me.offset().left + cardWidth/2,
			"top": me.offset().top + cardHeight/2
		}

		// Render an arrow
		$( 'html,body' ).css('cursor','pointer');
		$( 'body' ).append(arrowDiv);
		var arrow = $( '#arrow' );
		arrow.css({
			'position': 'absolute',
			'top': centerCoords.top - 30,
			'left': centerCoords.left
		});

		// Calculate new arrow position/angle
		$( document ).on("mousemove.arrowEvent", function(event) {
			let xDist = centerCoords.left - event.pageX;
			let yDist = centerCoords.top - event.pageY;
			let width = Math.sqrt(Math.pow(yDist, 2) + Math.pow(xDist, 2)) - 2;

			arrow.css('width', width);
			if (xDist < 0) {
				arrow.css({
					'-ms-transform': 'rotate('+ Math.atan(yDist/xDist) +'rad)',
					'-webkit-transform': 'rotate('+ Math.atan(yDist/xDist) +'rad)',
					'transform': 'rotate('+ Math.atan(yDist/xDist) +'rad)'
				});
			} else {
				arrow.css({
					'-ms-transform': 'rotate('+ (Math.atan(yDist/xDist) + Math.PI) +'rad)',
					'-webkit-transform': 'rotate('+ (Math.atan(yDist/xDist) + Math.PI) +'rad)',
					'transform': 'rotate('+ (Math.atan(yDist/xDist) + Math.PI) +'rad)'
				});
			}
		});

		// Look for target
		var target = null;
		$( '#enemyTable' ).delegate('.tablePortrait', "mouseenter.arrowEvent", function() {
			target = $( this );
		});

		$( '#enemyTable' ).delegate('.card', "mouseleave.arrowEvent", function() {
			target = null;
		});

		$( '#enemyHero' ).on("mouseenter.arrowEvent", function() {
			target = $( this );
		});

		$( '#enemyHero' ).on("mouseleave.arrowEvent", function() {
			target = null;
		});

		// Remove arrow and hit the target
		$( document ).on("mouseup.arrowEvent", function() {
			arrow.remove();
			if (target) {
				me.removeClass('playable');
				if (target.hasClass("hero")) {
					hitFace( me, true );
				} else {
					hit( me, target );
				}
			}
			$('html,body').css('cursor','default');
			$( document ).off(".arrowEvent");
			$( '#enemyTable' ).off(".arrowEvent");
		});
	});
}



// MAGIC STARTS HERE
if (window.localStorage.getItem('PlayerID')*1 != -1) {
	// CHOOSE RANDOM DECK
	var enDID = Math.random()*3;
	if (enDID>2) {
		enDID = 3;
	} else if (enDID>1) {
		enDID = 2;
	} else {
		enDID = 1;
	}
	var myDID = window.localStorage.getItem('ChosenDeckID');
	var myFID;
	var enFID;

	$.get(
		"/php/getCardsByDID.php",
		{
			"did": enDID
		},
		function( data1 ) {
			data1 = JSON.parse(data1);
			enFID = data1.FID;
			eDeck = data1.cards;
			shuffle(eDeck);
			$.get(
				"/php/getCardsByDID.php",
				{
					"did": myDID
				},
				function( data2 ) {
					data2 = JSON.parse(data2);
					myFID = data2.FID;
					mDeck = data2.cards;
					shuffle(mDeck);
					$(function () {
						begin();
					});
				}
			);
		}
	);
} else {
	alert("You need to log in to proceed!");
	window.location.replace("http://dbproj.kz/login.html");
}