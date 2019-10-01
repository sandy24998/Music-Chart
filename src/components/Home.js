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
      showModal: false,
      errorModal: 'show1',
      trackModal: 'show',
      artistsdata: [],
      artistModalVisibility: false,
      artistModal: 'hide2'
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
        // console.log(this.state.tracks);
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
      modalIsOpen: true,
      trackModal: 'show'
    });

    // sample link: http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Coldplay&api_key=4beaf9466fe996e7ec262761537a778c&format=json

    axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=4beaf9466fe996e7ec262761537a778c&mbid=${e}&format=json`
      )
      .then(response => {
        // console.log(response.data.track, this.state.error);
        let data =
          typeof response.data.track != undefined
            ? response.data.track
            : response.data.message;
        this.setState({
          tracksInfo: data,
          loading: false,
          errorModal: 'show1'
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    this.setState({
      loading: true
    });
  };

  hideModal = () => {
    this.setState({
      trackModal: 'hide'
    });
  };
  hideModal1 = () => {
    this.setState({
      errorModal: 'hide'
    });
  };

  hideModal2 = () => {
    this.setState({
      artistModal: 'hide2'
    });
  };

  getArtistsData = name => {
    this.setState({
      loading: true
    });
    axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${name}&api_key=4beaf9466fe996e7ec262761537a778c&format=json`
      )
      .then(response => {
        // console.log(response.data);
        this.setState({
          artistsdata: response.data,
          artistModalVisibility: true,
          artistModal: 'show2',
          trackModal: 'hide'
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    this.setState({
      loading: false
    });
  };

  render() {
    let trackDetails, artistsDetails;
    if (
      this.state.artistModalVisibility &&
      this.state.loading === false &&
      this.state.artistsdata !== undefined
    ) {
      artistsDetails = (
        <div id="myModal" className={this.state.artistModal}>
          <div className="dialog">
            <div className="modal-content">
              <br />
              <br />
              <img
                src={this.state.artistsdata.artist.image[3]['#text']}
                alt="Song"
              />

              <h4>{this.state.artistsdata.artist.name}</h4>
              <div className="modal-body">
                <p className="p2">
                  <span>{this.state.artistsdata.artist.stats.listeners}</span>{' '}
                  listeners
                </p>
                <p className="p2">
                  <span>{this.state.artistsdata.artist.stats.playcount}</span>{' '}
                  playcounts
                </p>
              </div>

              <div className="tags">
                {this.state.artistsdata.artist.tags.tag.map((item, id) => {
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
                  <span>{this.state.artistsdata.artist.bio.published}</span>
                </p>
                <p style={{ color: 'orange' }}>Related Artists</p>
                <div className="related-artists">
                  {this.state.artistsdata.artist.similar.artist.map(
                    (item, id) => {
                      return (
                        <div key={id} id="trackCard1">
                          <img src={item.image[2]['#text']} alt="TrackImage" />
                          <h4>{item.name}</h4>
                        </div>
                      );
                    }
                  )}
                </div>
                <p>{this.state.artistsdata.artist.bio.summary}</p>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                  onClick={this.hideModal2}
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
    }
    if (
      this.state.modalIsOpen &&
      this.state.loading === false &&
      this.state.tracksInfo !== undefined
    ) {
      trackDetails = (
        <div id="myModal" className={this.state.trackModal}>
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
                <p
                  className="p1"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.getArtistsData(this.state.tracksInfo.artist.name);
                  }}
                >
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
                  onClick={this.hideModal}
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
    }
    if (this.state.tracksInfo === undefined) {
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
          {this.state.loading ? (
            <img
              src={load}
              alt="Loading...."
              id="loader"
              style={{ textAlign: 'center' }}
            />
          ) : (
            this.state.tracks.map((item, id) => {
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

          <div id="myModal" className={this.state.errorModal}>
            <div className="dialog">
              <div className="modal-content error">
                <h1>Track Not Found</h1>
                <br />
                <div className="footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.hideModal1}
                  >
                    Close
                  </button>
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </>
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
        {this.state.loading ? (
          <img
            src={load}
            alt="Loading...."
            id="loader"
            style={{ textAlign: 'center' }}
          />
        ) : (
          this.state.tracks.map((item, id) => {
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
        <div>{artistsDetails}</div>
      </>
    );
  }
}
