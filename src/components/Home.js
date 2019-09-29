import React, { Component } from 'react';
import axios from 'axios';
import './Home.css';
import load from '../loading.gif';

export default class Home extends Component {
  constructor(props) {
    super(props);
    //Api Key ===  4beaf9466fe996e7ec262761537a778c
    this.state = {
      country: 'India',
      tracks: [],
      loading: false,
      modalIsOpen: false,
      tracksInfo: {},
      error: false
    };
  }

  changeCountry = e => {
    this.setState({
      country: e.target.value
    });
  };

  componentDidMount() {
    axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${this.state.country}&api_key=4beaf9466fe996e7ec262761537a778c&format=json`
      )
      .then(response => {
        this.setState({ tracks: response.data.tracks.track });
        this.setState({ tracks: this.state.tracks.slice(0, 10) });
        console.log(this.state.tracks);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  getData = () => {
    this.setState({ loading: true });
    axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${this.state.country}&api_key=4beaf9466fe996e7ec262761537a778c&format=json`
      )
      .then(response => {
        this.setState({ tracks: response.data.tracks.track, loading: false });
        this.setState({ tracks: this.state.tracks.slice(0, 10) });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  openModal = e => {
    this.setState({
      modalIsOpen: true
    });
    axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=4beaf9466fe996e7ec262761537a778c&mbid=${e}&format=json`
      )
      .then(response => {
        if (response !== undefined) {
          this.setState({
            tracksInfo: response.data.track,
            loading: false
          });
        } else {
          this.setState({
            error: true
          });
        }
        console.log(this.state.tracksInfo, this.state.error);
      })
      .catch(function(error) {
        console.log(error);
      });
    this.setState({
      loading: true
    });
  };

  render() {
    const { tracks, loading, error } = this.state;
    // console.log(tracks);
    let trackDetails;
    if (
      this.state.modalIsOpen &&
      loading === false &&
      error === false &&
      this.state.tracksInfo !== undefined
    ) {
      trackDetails = (
        <div id="myModal">
          <div className="dialog">
            <div className="modal-content">
              <br />
              <br />
              <img
                src={this.state.tracksInfo.album.image[3]['#text']}
                alt="Song"
              />

              <h4>{this.state.tracksInfo.name}</h4>
              <div className="modal-body">
                <p className="p1">
                  Album : <span>{this.state.tracksInfo.album.title}</span>
                </p>
                <p className="p1">
                  Artist : <span>{this.state.tracksInfo.album.artist}</span>
                </p>
                <br />
                <p className="p2">
                  <span>{this.state.tracksInfo.listeners}</span> listeners
                </p>
                <p className="p2">
                  <span>{this.state.tracksInfo.playcount}</span> playcounts
                </p>
              </div>

              <div className="tags">
                {this.state.tracksInfo.toptags.tag.map((item, id) => {
                  return (
                    <button type="button" className="btn btn-warning" key={id}>
                      {item.name}
                    </button>
                  );
                })}
              </div>
              <br />

              <div className="footer">
                <p>
                  Published On :{' '}
                  <span>{this.state.tracksInfo.wiki.published}</span>
                </p>
                <p>{this.state.tracksInfo.wiki.summary}</p>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
              <br />
              <br />
            </div>
          </div>
        </div>
      );
    } else {
      trackDetails = (
        <div id="myModal">
          <div className="dialog">
            <div className="modal-content error">
              <h1>Track Not Found</h1>
              <br />
              <div className="footer">
                <button type="button" className="btn btn-danger">
                  Close
                </button>
              </div>
              <br />
              <br />
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div id="header">
          <h1>Top tracks in {this.state.country}</h1>
        </div>
        <div id="countrySelector">
          <select onChange={this.changeCountry}>
            <option value="india">India</option>
            <option value="canada">Canada</option>
            <option value="france">France</option>
            <option value="china">China</option>
            <option value="greece">Greece</option>
            <option value="japan">Japan</option>
          </select>
          <input type="submit" value="Search" onClick={this.getData} />
        </div>
        {loading ? (
          <img
            src={load}
            alt="Loading...."
            id="loader"
            style={{ textAlign: 'center' }}
          />
        ) : (
          tracks.map((item, id) => {
            return (
              <div key={id} id="trackCard">
                <img
                  src={item.image[2]['#text']}
                  alt="TrackImage"
                  onClick={() => this.openModal(item.mbid)}
                />
                <h4>{item.name}</h4>
                <p>{item.artist.name}</p>
              </div>
            );
          })
        )}
        <div>{trackDetails}</div>
      </>
    );
  }
}
