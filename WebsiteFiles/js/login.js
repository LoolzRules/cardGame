const err = '<span id="errSpan"></span>';

if (window.localStorage.getItem('PlayerID')*1 != -1) {
	window.location.replace("http://dbproj.kz/menu.html");
} else {
	$( '#switchReg' ).on('click', function() {
		$ ( '#register' ).fadeIn({
			duration: 200
		});
	});

	$( '#switchLog' ).on('click', function() {
		$ ( '#register' ).fadeOut({
			duration: 200
		});
	});

	$( '#goLogin' ).on('click', function() {

		$( '#errSpan' ).remove();

		$.post(
			"/php/checkUser.php",
			{
				"login": $( 'input[name=getLogin]' ).val(),
				"pswd": $( 'input[name=getPswd]' ).val()
			},
			function( data ) {

				if (data == 'f') {
					$( 'input[name=getPswd]' ).after(err);
					$( '#errSpan' ).text('No such player exists. New here? Go register!');
					$( '#errSpan' ).css('display', 'inline-block');

				} else if (data == 'w') {
					$( 'input[name=getPswd]' ).after(err);
					$( '#errSpan' ).text('The password is wrong');
					$( '#errSpan' ).css('display', 'inline-block');
					
				} else {
					window.localStorage.setItem('PlayerID', data);
					window.localStorage.setItem('PlayerName', $( 'input[name=getLogin]' ).val());
					window.location.replace("http://dbproj.kz/menu.html");
				}
			}
		);
	});

	$( '#goRegister' ).on('click', function() {

		$( '#errSpan' ).remove();

		if ($( 'input[name=setLogin]' ).val().length < 6 || $( 'input[name=setLogin]' ).val().length > 30) {
			$( 'input[name=setLogin]' ).after(err);
			$( '#errSpan' ).text('Your login should be 6-30 characters long');
			$( '#errSpan' ).css('display', 'inline-block');

		} else if ($( 'input[name=setPswd1]' ).val().length < 6 || $( 'input[name=setPswd1]' ).val().length > 30) {
			$( 'input[name=setPswd1]' ).after(err);
			$( '#errSpan' ).text('Your password should be 6-30 characters long');
			$( '#errSpan' ).css('display', 'inline-block');

		} else if ($( 'input[name=setPswd1]' ).val() != $( 'input[name=setPswd2]' ).val()) {
			$( 'input[name=setPswd2]' ).after(err);
			$( '#errSpan' ).text('These passwords don\'t match. Try again?');
			$( '#errSpan' ).css('display', 'inline-block');

		} else if ($( 'input[name=setEmail]' ).val() == "") {
			$( 'input[name=setEmail]' ).after(err);
			$( '#errSpan' ).text('Please type an e-mail');
			$( '#errSpan' ).css('display', 'inline-block');

		} else {

			$.get(
				"/php/checkLogin.php",
				{ "login": $( 'input[name=setLogin]' ).val()},
				function( data ) {

					if (data == 'e') {
						$( 'input[name=setLogin]' ).after(err);
						$( '#errSpan' ).text('Such login already exists');
						$( '#errSpan' ).css('display', 'inline-block');

					} else {

						$( '#errSpan' ).css('display', 'none');
						var login = $( 'input[name=setLogin]' ).val();

						$.post(
							"/php/setNewPlayer.php",
							{
								"login": login,
								"pswd": $( 'input[name=setPswd2]' ).val(),
								"email": $( 'input[name=setEmail]' ).val()
							},
							function( data ) {
								alert("You were successfully registered");
								window.localStorage.setItem('PlayerID', data);
								window.localStorage.setItem('PlayerName', login);
								window.location.replace("http://dbproj.kz/menu.html");
							}
						);
					}
				}
			);
		}
	});
}

