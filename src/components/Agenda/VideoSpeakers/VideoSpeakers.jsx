import React from 'react';
import moment from 'moment/moment';
import _ from 'lodash';
import styles from './VideoSpeakers.module.scss';

class VideoSpeakers extends React.Component {
  render() {
    const { speakers, onSpeakerClick } = this.props;

    return (
      <div className={styles.speakersContainer}>
        {_.sortBy(speakers, 'start_time').map((speaker, i) => {
          const time = moment('2015-01-01')
            .startOf('day')
            .seconds(speaker.start_time)
            .format('H:mm:ss');
          return (
            <div
              key={i}
              className={styles.speakersListItem}
              style={{ backgroundColor: i % 2 === 0 ? '#eee' : '#fff' }}
            >
              <div className="main" onClick={() => onSpeakerClick(speaker.start_time)}>
                <div>
                  <b>Naam spreker:</b> {speaker.speaker.firstname} {speaker.speaker.lastname}
                </div>
                <div>
                  <b>Tijdsduur:</b> {time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default VideoSpeakers;
