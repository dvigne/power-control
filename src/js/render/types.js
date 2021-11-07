const status_flags = {
  CH1_CC_CV: 0,
  CH2_CC_CV: 1,
  TRACK_STATE1: 4,
  TRACK_STATE2: 8,
  CH1_STATE: 16,
  CH2_STATE: 32,
  CH1_TIMER: 64,
  CH2_TIMER: 128,
  CH1_DISP: 256,
  CH2_DISP: 512,
};

const track_state = {
  INDEPENDANT: 4,
  PARALLEL: 8,
  SERIES: 12,
}

export {status_flags, track_state};
