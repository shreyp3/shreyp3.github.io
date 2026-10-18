/* ================================================================
   PROJECT DATA — this is the ONLY file you need to touch to add,
   edit, or remove a project. Both the homepage project grid and
   every project's detail page (project.html) are generated from
   this array automatically — no new HTML files needed per project.

   TO ADD A NEW PROJECT:
   1. Copy the EXAMPLE object below and paste it into the PROJECTS
      array as a new entry.
   2. Give it a unique `id` (used in the URL as project.html?id=...
      and as the folder name for its images).
   3. Drop your images in assets/images/projects/<id>/ and point
      `thumbnail` / `gallery` at them. Until real images exist,
      broken paths automatically fall back to a placeholder icon.
   4. For demo videos, upload to YouTube (Unlisted is fine so it's
      not publicly searchable) and paste just the video ID — the
      part of the URL after "v=".
      e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ -> "dQw4w9WgXcQ"
   5. Save the file and refresh the page — no build step.

   FIELD REFERENCE:
   id          (required) unique slug — used in the URL and image folder name
   title       (required) project name
   subtitle    (optional) short one-line tagline shown under the title
   date        (optional) e.g. "Spring 2026" or "Jan 2026 – Mar 2026"
   featured    (optional) true/false — featured projects get a larger card
   thumbnail   (required) path to the image shown on the homepage card
   tags        (optional) array of tech/tool strings shown as pills
   summary     (required) 2–4 sentence overview shown on the card + detail page
   description (optional) array of paragraph strings for the full write-up
   details     (optional) { goal, approach, results, impact } highlight blocks
   gallery     (optional) array of image paths for the detail page gallery
   videos      (optional) array of { youtubeId, caption } demo videos
   links       (optional) { github, demo } URLs
   ================================================================ */

const PROJECTS = [
  {
    id: "quadcopter",
    title: "Quadcopter and RC System",
    subtitle:
      "A fully functional drone and wireless remote built from scratch around the ESP32.",
    date: "In-progress",
    featured: true,
    thumbnail: "assets/images/projects/quadcopter/drone.jpg",
    tags: ["C/C++", "ESP32", "FreeRTOS", "DShot300", "WiFi UDP", "IMU"],
    summary:
      "A custom quadcopter and handheld remote where nearly every layer was " +
      "written from scratch, including the motor protocol, the wireless link, and " +
      "the flight-control firmware. Built on an ESP32, it taught me how real " +
      "flight controllers work under the hood instead of relying on an " +
      "off-the-shelf stack.",
    description: [
      "Most hobby drones are built on pre-made flight controllers and firmware. " +
        "I wanted to understand what actually happens between a stick input and a " +
        "spinning motor, so I built the whole system myself on an ESP32: the " +
        "firmware, the motor driver, the wireless link, and the remote.",
      "The drone drives its four brushless motors using a custom DShot300 " +
        "implementation built on the ESP32's RMT peripheral, which generates the " +
        "precise digital timing the ESC protocol needs. Control commands travel " +
        "from the remote over WiFi UDP, with the drone hosting its own access " +
        "point so no router is required. I originally prototyped the link with " +
        "ESP-NOW, then moved to direct UDP for a more flexible and reliable " +
        "connection. An onboard IMU feeds attitude data into the control loop, " +
        "and FreeRTOS tasks keep sensing, control, and communication running on " +
        "predictable schedules.",
      "The hardest problems were hardware-level. I corrected the IMU axis " +
        "mapping so orientation matched the physical frame, and I tracked down a " +
        "persistent thrust asymmetry between motor pairs. Rather than tune around " +
        "it, I implemented per-motor trim calibration, which balanced the " +
        "thrust and made the drone stable and controllable. If I rebuilt it, I'd " +
        "add motor and thrust characterization at the start of the project " +
        "instead of discovering the imbalance during bring-up.",
    ],
    details: {
      goal: "Build a fully functional quadcopter and remote control system from scratch, without relying on a pre-built flight controller.",
      approach:
        "ESP32 firmware on FreeRTOS, a custom RMT-based DShot300 motor driver, an IMU for attitude sensing, per-motor trim calibration, and a WiFi UDP link between the remote and a drone-hosted access point.",
      results:
        "A complete, flying quadcopter with a custom motor driver, a reliable wireless control link, correctly mapped IMU data, and calibrated motors that deliver balanced thrust.",
      impact:
        "A deep, hands-on understanding of real-time embedded control, motor protocols, and wireless communication, the same fundamentals behind commercial flight controllers and robotics platforms.",
    },
    gallery: [
      "assets/images/projects/quadcopter/rc.jpg",
      "assets/images/projects/quadcopter/drone.jpg",
      "assets/images/projects/quadcopter/droneTopView.jpg",
      "assets/images/projects/quadcopter/droneSideView.jpg",
      "assets/images/projects/quadcopter/droneBottom.jpg",
      "assets/images/projects/quadcopter/droneUnwired.jpg",
    ],
    links: {
      github: "https://github.com/shreyp3/quadcopter",
      demo: "",
    },
  },

  {
    id: "health_monitor",
    title: "AI-Powered Health Monitor",
    subtitle:
      "A functional wearable that tracks your vitals, with an AI agent in a custom phone app that explains them for you.",
    date: "Summer 2026",
    featured: true,
    thumbnail: "assets/images/projects/health/healthFinalWithFingers.jpg",
    tags: [
      "C",
      "ESP-IDF",
      "FreeRTOS",
      "BLE",
      "KiCad",
      "React Native",
      "Llama 3",
    ],
    summary:
      "A two-piece wearable, a wrist unit plus a finger clip, that measures heart " +
      "rate, blood oxygen, motion, and temperature, then streams the data over " +
      "Bluetooth to a custom mobile app. An AI agent in the app turns the raw " +
      "numbers into plain-language explanations.",
    description: [
      "Consumer health trackers show a lot of numbers but rarely explain them. I " +
        "wanted to build a complete system, from the sensors and PCB through the " +
        "firmware and phone app, that not only collects vitals but helps people " +
        "understand what they mean.",
      "The hardware is built around an ESP32-WROOM-32 with a MAX30102 " +
        "pulse oximeter, an MLX90614 infrared temperature sensor, an MPU6050 " +
        "motion sensor, and an SSD1306 OLED display. The firmware is written in C " +
        "on ESP-IDF and FreeRTOS, sampling sensors at 100 Hz and sending JSON " +
        "over BLE. I designed a custom 2-layer PCB in KiCad, had it fabricated " +
        "through JLCPCB, and assembled and tested it myself. The companion app is " +
        "built in React Native (Expo) with Dashboard, History, AI Agent, and " +
        "Settings screens. It connects over BLE GATT and sends readings to Llama " +
        "3.3 70B through the Groq API.",
      "Simple peak detection turned out to be too fragile for the noisy PPG " +
        "signal, so I switched to a 0.5-5 Hz Butterworth bandpass filter, which " +
        "made heart-rate extraction far more reliable. On the app side, the Groq " +
        "SDK doesn't work in React Native, so I called the API directly with " +
        "fetch. Natural extensions would be a 3D-printed enclosure and cloud " +
        "logging for long-term trend analysis.",
    ],
    details: {
      goal: "Build an end-to-end wearable health system, covering hardware, firmware, mobile app, and AI interpretation, that makes vitals understandable to non-experts.",
      approach:
        "ESP32 firmware on FreeRTOS reading three I2C sensors at 100 Hz, with Butterworth-filtered PPG, JSON over BLE, a custom KiCad PCB, and a React Native app that sends data to Llama 3.3 70B via Groq.",
      results:
        "A working, assembled wearable with a fabricated custom PCB, live vitals streaming to the app, and an AI agent that explains the readings.",
      impact:
        "Shows how embedded hardware and AI can combine to make personal health data more accessible and actionable.",
    },
    gallery: [
      "assets/images/projects/health/ProtoUnfinished.jpg",
      "assets/images/projects/health/Proto.jpg",
      "assets/images/projects/health/ProtoTest.jpg",
      "assets/images/projects/health/PCBInnerDes.jpg",
      "assets/images/projects/health/PCBDes.jpg",
      "assets/images/projects/health/healthPCBw_Proto.jpg",
      "assets/images/projects/health/healthFinalUnplugged.jpg",
      "assets/images/projects/health/healthFinalWithFingers.jpg",
    ],
    links: {
      github: "https://github.com/shreyp3/health-monitor",
      demo: "",
    },
  },

  {
    id: "sarc",
    title: "Semi-Autonomous Robotic Car",
    subtitle:
      "A car that takes voice and vision input to move, and can follow the user around.",
    date: "Summer 2025",
    featured: true,
    thumbnail: "assets/images/projects/sarc/sarc.jpg",
    tags: [
      "Python",
      "OpenCV",
      "Raspberry Pi",
      "Arduino",
      "Vosk",
      "Computer Vision",
    ],
    summary:
      "A robotic car that listens for spoken commands and uses a camera to track " +
      "and follow a person. A Raspberry Pi handles speech and vision while an " +
      "Arduino handles real-time motor control. The project was presented at the " +
      "SURF and GURC undergraduate research symposiums.",
    description: [
      "I wanted to build a robot that interacts with people in a natural way, " +
        "so you can talk to it and it can see you. The goal was a car that takes " +
        "voice commands and can also lock onto a person and follow them.",
      "The system splits work across two processors. A Raspberry Pi runs the " +
        "perception stack: OpenCV for visual tracking and Vosk for offline speech " +
        "recognition, so voice control works without an internet connection. An " +
        "Arduino handles low-level motor control, receiving high-level movement " +
        "commands from the Pi. Keeping time-sensitive motor control separate from " +
        "heavier vision processing kept the car responsive.",
      "Getting tracking to stay stable under changing lighting and distance, and " +
        "keeping speech recognition accurate with motor noise nearby, took a lot " +
        "of iteration. I presented the finished work at SURF at Wofford College " +
        "and GURC at Emory University. Obstacle avoidance would be a natural " +
        "extension for making the car fully autonomous.",
    ],
    details: {
      goal: "Create a car that can understand voice commands and visually track and follow a user.",
      approach:
        "A Raspberry Pi for OpenCV tracking and offline Vosk speech recognition, paired with an Arduino for real-time motor control.",
      results:
        "A working car that accepts voice commands and follows a person using camera input, presented at two undergraduate research conferences.",
      impact:
        "A practical foundation for human-following robots and assistive mobile platforms that work without cloud connectivity.",
    },
    gallery: [
      "assets/images/projects/sarc/sarc.jpg",
      "assets/images/projects/sarc/sarcFront.jpg",
      "assets/images/projects/sarc/sarcSide.jpg",
      "assets/images/projects/sarc/sarcTop.jpg",
      "assets/images/projects/sarc/sarcW_code.jpg",
      "assets/images/projects/sarc/sarcWeyes.jpg",
      "assets/images/projects/sarc/sarcCamTracker.png",
      "assets/images/projects/sarc/listenerTerminal.png"
    ],
    videos: [{ youtubeId: "ONwmAr0-pxo", caption: "Simple Voice Commands" }, { youtubeId: "ij57hmzTR4Q", caption: "\"Follow Me\" Command" }],
    links: {
      github: "https://github.com/shreyp3/semi-autonomous-robot-car",
      demo: "",
    },
  },

  {
    id: "gbsc",
    title: "Gesture-Based Drone Control",
    subtitle:
      "A system that lets the user control a drone simply by moving their hand.",
    date: "Spring 2025",
    featured: true,
    thumbnail: "assets/images/projects/gbdc/inAirControl.png",
    tags: ["MATLAB", "Vicon", "Firebase", "Motion Capture", "Drones"],
    summary:
      "A hands-free control system that tracks hand movement with motion " +
      "capture and translates it into flight commands for a drone. Instead of " +
      "joysticks, you steer the drone by moving your hand through the air.",
    description: [
      "Traditional drone remotes take practice, and the sticks don't map " +
        "intuitively to movement. I wanted to explore a more natural interface " +
        "where the drone simply mirrors what your hand does.",
      "The system uses a Vicon motion capture setup to track the position and " +
        "orientation of the hand in real time. MATLAB processes that pose data " +
        "and converts it into drone control commands, and a Firebase relay " +
        "carries the commands to the drone wirelessly.",
      "The main challenges were mapping hand motion to commands smoothly, " +
        "without jitter or accidental inputs, and keeping latency low enough " +
        "that control felt responsive. I solved these with filtering and dead " +
        "zones on the input. A wearable sensor would be a natural extension, " +
        "removing the dependence on a motion capture room.",
    ],
    details: {
      goal: "Make drone control more intuitive by replacing joysticks with natural hand gestures.",
      approach:
        "Vicon motion capture for hand tracking, MATLAB for converting pose data to commands, and Firebase as a wireless relay to the drone.",
      results:
        "A working gesture-driven control pipeline that lets a user fly a drone with hand movements alone.",
      impact:
        "Points toward more accessible drone and robot interfaces for people who find traditional controllers hard to learn.",
    },
    gallery: [
      "assets/images/projects/gbdc/viconEnv.png",
      "assets/images/projects/gbdc/viconCam.jpg",
      "assets/images/projects/gbdc/droneSim.png",
      "assets/images/projects/gbdc/protoController.jpg",
      "assets/images/projects/gbdc/drone.jpg",
      "assets/images/projects/gbdc/finalController.jpg",
      "assets/images/projects/gbdc/inAirControl.png",
    ],
    videos: [{ youtubeId: "CtrleDku7wE", caption: "Simulation" }, { youtubeId: "GEdnWCsS0jc", caption: "Real-Life Flight" }],
    links: {
      github: "https://github.com/shreyp3/gesture-based-drone-control",
      demo: "",
    },
  },
];
