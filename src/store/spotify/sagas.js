import {
  put, takeEvery, call,
  select, take
} from 'redux-saga/effects';

import {
  getUserProfileSpotify, getDeviceID, spotifyPlayTrack,
  spotyfiDevice, spotifyPauseTrack, spotifyPositionTrack,
  spotifySetVolume, spotifyShuffleTrack, spotifyRepeatTrack,
  spotifyPreviousTrack, spotifyNextTrack
} from './helpers/spotify-helper';
import {
  GET_ACCESS_TOKEN_SPOTIFY, SUCCESS_GET_USER_PROFILE_SPOTIFY,
  PLAY_TRACK, PAUSE_TRACK, SEEK_TO_POSITION_IN_CURRENTLY_PLAYING_TRACK,
  SET_VOLUME_FOR_PLAYBACK, TOGGLE_SHUFFLE_FOR_PLAYBACK, SET_REPEAT_MODE_ON_PLAYBACK,
  SKIP_PLAYBACK_TO_PREVIOUS_TRACK, SKIP_PLAYBACK_TO_NEXT_TRACK, SUCCESS_GET_DEVICE_ID
} from './types';
import { successGetUserProfileSpotify, successGetDeviceID } from './actions';
import { errorMessage } from '../error/actions';
import { setUserTokenSpotify } from '../../utilities/APIConfig';
import { getDataPlayer } from './helpers/selector';

export function* getUserProfile({ payload }) {
  const { token } = payload;
  const tokenFromString = token.split('=');
  setUserTokenSpotify(tokenFromString[1]);
  try {
    const profile = yield call(getUserProfileSpotify);
    yield put(successGetUserProfileSpotify(profile.data, tokenFromString[1]));
  } catch (e) {
    yield put(errorMessage(e.message));
  }
}
export function* getDeviceIDUser({ payload }) {
  const { token } = payload;
  try {
    const deviceID = yield call(getDeviceID, token);
    spotyfiDevice(token, deviceID);
    yield put(successGetDeviceID(deviceID));
  } catch (e) {
    yield put(errorMessage(e.message));
  }
}
export function* playTrackToSpotify({ payload }) {
  const { track, playingTracks } = payload;
  const { idTrack, timeStop, deviceID } = yield select(getDataPlayer);
  if (deviceID === '') yield take(SUCCESS_GET_DEVICE_ID);
  const arrayTracks = playingTracks.map(e => `spotify:track:${e.spotify_id}`);
  let time = 0;
  if (idTrack === track) time = timeStop;
  yield call(spotifyPlayTrack, arrayTracks, track, time, deviceID);
}
export function* pauseTrackToSpotify() {
  yield call(spotifyPauseTrack);
}
export function* positionTrack({ payload }) {
  const { position } = payload;
  const { deviceID } = yield select(getDataPlayer);
  yield call(spotifyPositionTrack, position, deviceID);
}
export function* setVolume({ payload }) {
  const { volume } = payload;
  const { deviceID } = yield select(getDataPlayer);
  yield call(spotifySetVolume, volume, deviceID);
}
export function* shuffleTrack({ payload }) {
  const { shuffle } = payload;
  const { deviceID } = yield select(getDataPlayer);
  yield call(spotifyShuffleTrack, shuffle, deviceID);
}
export function* setRepeatTrack({ payload }) {
  const { repeat } = payload;
  const { deviceID } = yield select(getDataPlayer);
  let str = 'off';
  if (repeat) str = 'track';
  yield call(spotifyRepeatTrack, str, deviceID);
}
export function* previousTrack() {
  const { deviceID } = yield select(getDataPlayer);
  yield call(spotifyPreviousTrack, deviceID);
}
export function* nextTrack() {
  const { deviceID } = yield select(getDataPlayer);
  yield call(spotifyNextTrack, deviceID);
}

export function* sagasSpotify() {
  yield takeEvery(GET_ACCESS_TOKEN_SPOTIFY, getUserProfile);
  yield takeEvery(SUCCESS_GET_USER_PROFILE_SPOTIFY, getDeviceIDUser);
  yield takeEvery(PLAY_TRACK, playTrackToSpotify);
  yield takeEvery(PAUSE_TRACK, pauseTrackToSpotify);
  yield takeEvery(SEEK_TO_POSITION_IN_CURRENTLY_PLAYING_TRACK, positionTrack);
  yield takeEvery(SET_VOLUME_FOR_PLAYBACK, setVolume);
  yield takeEvery(TOGGLE_SHUFFLE_FOR_PLAYBACK, shuffleTrack);
  yield takeEvery(SET_REPEAT_MODE_ON_PLAYBACK, setRepeatTrack);
  yield takeEvery(SKIP_PLAYBACK_TO_PREVIOUS_TRACK, previousTrack);
  yield takeEvery(SKIP_PLAYBACK_TO_NEXT_TRACK, nextTrack);
}
