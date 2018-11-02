let userAccessToken = '';
const clientID = '4f46a6e0ce73479dac201d0cdbaabac5';
const redirectURI = "http://localhost:3000/";

const Spotify = {
	  getAccessToken() {
		if(userAccessToken) {
			return userAccessToken;
		}
		const accessToken = window.location.href.match(/access_token=([^&]*)/);
		const expireTime = window.location.href.match(/expires_in=([^&]*)/);
		if(accessToken && expireTime) {
			userAccessToken = accessToken[1];
			let expireTimeNumber = Number(expireTime[1]);
			window.setTimeout(() => userAccessToken = '', expireTimeNumber * 1000);
			window.history.pushState('Access Token', null, '/');
			return userAccessToken;
		} else {
		const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
		window.location = accessURL;
  }
	},

	search(searchTerm) {
		let accessToken = Spotify.getAccessToken();
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
  			headers: {Authorization: `Bearer ${accessToken}`}}
  			).then(response => {return response.json();}
  			).then(jsonResponse => {
  				if(jsonResponse.tracks) {
  					return jsonResponse.tracks.items.map(track => ({id:track.id, name:track.name, artist:track.artists[0].name, album:track.album.name, uri:track.uri})
  				)}
  				return [];
  			}
  )
	},

	savePlaylist(playlistName, uriArray) {
		if(!playlistName || !uriArray) {
			return;
		}
		const currentAccess= this.getAccessToken();
		const headers = { Authorization: `Bearer ${currentAccess}` };
		let userID = '';

		return fetch('https://api.spotify.com/v1/me', {headers: headers}
			).then(response => response.json()
			).then(jsonResponse => {
				userID = jsonResponse.id;
				return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {headers:headers, method:'POST', body:JSON.stringify({name:playlistName})}
					).then(response => response.json()
					).then(jsonResponse => {
						const playlistID = jsonResponse.id;
						return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {headers:headers, method:'POST', body:JSON.stringify({uris:uriArray})})
			})})

	}
}
export default Spotify;