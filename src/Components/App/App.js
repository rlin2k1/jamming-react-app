import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify/Spotify.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {searchResults:[],
                  playlistName : "New Playlist",
                  playlistTracks: []
                  };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if(!this.state.playlistTracks.includes(track)) {
        let testTrack = this.state.playlistTracks;
        testTrack.push(track);
        this.setState({playlistTracks:testTrack});
    }
  }

  removeTrack(track) {
    let testTrack = this.state.playlistTracks.filter(function(el){
      return el.id !== track.id;
    })
    this.setState({playlistTracks:testTrack});
  }

  updatePlaylistName(name){
     this.setState({playlistName:name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    })
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({searchResults:[], playlistName:"New Playlist", playlistTracks:[]});
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {this.setState({searchResults:searchResults})});

  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName = {this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;