<?php
define('REDIRECTURI', 'https://comp-server.uhi.ac.uk/~12001649/public_html/bsc-hons/web-programming/pure-mad-zombies/public_html');
define('REDIRECTTOKENURI', 'https://comp-server.uhi.ac.uk/~12001649');

const PROVIDERLIST = array(
	[
		'providername' => 'Discord',
		'data' => [
			'authURL' => 'https://discord.com/api/oauth2/authorize',
			'tokenURL' => 'https://discord.com/api/oauth2/token',
			'apiURL' => 'https://discord.com/api/users/@me',
			'revokeURL' => 'https://discord.com/api/oauth2/token/revoke',
			'scope' => 'indentify',
			'class' => 'OAuth'
		]
	],
	
	[
		'providername' => 'Github',
		'data' => [
			'authURL' => '',
			'tokenURL' => '',
			'apiURL' => '',
			'revokeURL' => '',
			'scope' => '',
			'class' => 'OAuth'
		]
	],
	
	[
		'providername' => 'Reddit',
		'data' => [
			'authURL' => '',
			'tokenURL' => '',
			'apiURL' => '',
			'revokeURL' => '',
			'scope' => '',
			'class' => 'OAuth'
		]
	]
);
?>
