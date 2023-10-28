<?php
require_once('defs.php');

class OAuth {

	private $providerName, $authUrl, $tokenUrl, $apiUrl, $revokeUrl, $scope;
	protected $secret, $cid;

	public function __construct($providerInfo, $cid, $secret){
		$this->providerName = $providerInfo['providername'];
		$this->authUrl = $providerInfo['data']['authURL'];
		$this->tokenUrl = $providerInfo['data']['tokenURL'];
		$this->apiUrl = $providerInfo['data']['apiURL'];
		$this->revokeUrl = $providerInfo['data']['revokeURL'];
		$this->scope = $providerInfo['data']['scope'];
		$this->secret = $secret;
		$this->cid = $cid;
	}

	// Class getters and setters
	public function getProviderName(){return $this->providerName;}
	public function getAuthUrl(){return $this->authUrl;}
	public function getTokenUrl(){return $this->tokenUrl;}
	public function getApiUrl(){return $this->apiUrl;}
	public function getRevokeUrl(){return $this->revokeUrl;}
	public function getScope(){return $this->scope;}

	private function setProviderName($providerName){$this->providerName = $providerName;}
	private function setAuthUrl($authUrl){$this->authUrl = $authUrl;}
	private function setTokenUrl($tokenUrl){$this->tokenUrl = $tokenUrl;}
	private function setApiUrl($apiUrl){$this->apiUrl = $apiUrl;}
	private function setRevokeUrl($revokeUrl){$this->revokeUrl = $revokeUrl;}
	private function setScope($scope){$this->scope = $scope;}

	public function generateLoginText(){
		return '<p><a href="?action=login&provider='.$this->providerName.'">Login '.$this->providerName.'</a></p>';
	}

	public function login(){
		$params = array(
			'client_id' => $this->cid,
			'redirect_uri' => REDIRECTURI,
			'response_type' => 'code',
			'scope' => $this->getScope()
		);

		header('Location: '.$this->getAuthUrl().'?'.http_build_query($params));
		die();
	}

}

class ProviderHandler {

	private $providerList = [];
	private $action, $activeProvider, $code, $accessToken, $status, $providerInstance;

	//Class getters and setters
	public function getProviderList(){return $this->providerList;}
	public function getAction(){return $this->action;}
	public function getCode(){return $this->code;}
	public function getAccessToken(){return $this->accessToken;}
	public function getStatus(){return $this->status;}
	public function getProviderInstance(){return $this->providerInstance;}

	private function setProviderList($providerList){$this->providerList = $providerList;}
	private function setActiveProvider($activeProvider){$this->activeProvider = $activeProvider;}
	private function setCode($code){$this->code = $code;}
	private function setAccessToken($accessToken){$this->accessToken = $accessToken;}
	private function setStatus($status){$this->status = $status;}
	private function setProviderInstance($providerInstance){$this->providerInstance = $providerInstance;}

	public function __construct(){
		if(session_status() !== PHP_SESSION_ACTIVE){
			session_start();
		}
		$this->action = $this->getGetParam('action');
		if($this->getGetParam('provider')) $this->activeProvider = $this->getGetParam('provider');
		else $this->activeProvider = $this->getSessionValue('provider');
	}

	public function performAction(){
		foreach($this->providerList as $provider){
			if($provider->providerName == $this->activeProvider){
				$this->setProviderInstance($provider);
				if($this->action == 'login'){
					$this->login();
				} else if($this->action == 'logout'){
					$this->logout();
				}
			}
		}
	}

	public function addProvider($name){
		$providerInfo = $this->getProviderData($name);
		if($providerInfo !== null){
			array_push($this->providerList, new $providerInfo['data']['class']($providerInfo));
		}
	}

	public function getProviderData($name){
		foreach(PROVIDERLIST as $provider){
			if($provider['providername'] == $name){
				return $provider;
			}

			return null;
		}
	}

	public function generateLoginText(){
		$result = '';
		foreach($this->providerList as $provider){
			$result .= $provider->generateLoginText();
		}
		return $result;
	}

	public function getGetParam($key, $default=null){
		return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
	}

	public function getSessionValue($key, $default=null){
		return array_key_exists($key, $_SESSION) ? $_GET[$key] : $default;
	}

	public function setSessionValue($key, $value){
		$_SESSION[$key] = $value;
	}

	public function login(){
		$this->setSessionValue('provider', $this->providerInstance->getProviderName());
		$this->getProviderInstance()->login();
	}

	public function logout(){

	}
}
