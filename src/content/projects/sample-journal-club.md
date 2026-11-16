---
title: EEG Artifact Detection
summary: Identifying and analyzing non-neural artifacts in EEG recordings to
  improve signal quality.
category: Engineering Projects
status: Planned
featured: true
leads:
  - David Kwack
skills:
  - OpenBCI Cyton
  - Signal Processing
  - Literature Review
  - Data Collection & Presentation
goals: >
  Our goal is to record and compare common EEG artifacts and deliver an
  interactive artifact demo, a reference guide, and a comparison poster for
  UROP.
start_date: 2027-01-11
end_date: 2027-05-03
draft: false
---
Our team will record and characterize the most common EEG artifacts such as, eye blinks, eye movements, jaw clenching, muscle activity, head movement. We will collect short, structured recordings in which a participant performs each artifact on cue, with markers in the data so every event is labeled. This gives us clean examples of what each artifact looks like in the time domain, the frequency domain, and across electrode locations, whether that be Fz or Oz. 

We’ll then analyze the recordings in Python 3.8 and quantify each artifact’s amplitude, duration, spectral content, and scalp distribution, and test basic filtering approaches to show what each one fixes and what it distorts. The results will go into a reference guide that puts each artifact’s characteristics side by side. This will help give a great distinction for the audience to clearly understand behind the relationship of the measurements received on the EEG with the specific artifact.

We’ll turn the findings into an interactive demo where users can select an artifact and view its example waveform, spectrum, and scalp topography. This will be important in giving our project an interactive unique component in our project that will motivate the students to learn skills with an EEG and other tools. We’ll also make a comparison poster that we hope to present at UROP to help give the students within the team motivation to have an end goal in mind and achieve something that would be valuable within their resumes.