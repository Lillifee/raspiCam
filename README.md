# 📷 RaspiCam

RaspiCam is a react application to stream, take pictures or record videos from your raspberry pi camera over a web interface. The live stream is provided over a simple HTTP request and displayed by the brilliant [Broadway h264 player](https://github.com/mbebenita/Broadway).

- **Simple**: mobile first designed user interface to provide a flawless user experience on the smartphone.
- **Lightweight**: raspicam uses the build in raspistill and raspivid to stream, capture and record videos.

## Hardware
I'm using a **Raspberry PI Zero W** with a **Raspberry PI HQ camera**.

![picture](screenshots/camera.jpg)

# Installation

## Raspberry PI OS

If your raspberry is already up and running, you can skip this section and continue with the "Install Node.js" section. 

Install the latest Raspberry Pi OS Lite with the [Raspberry PI imager](https://www.raspberrypi.org/software/). Feel free to use the desktop version, but it's not necessary for the application.  

Usefull links:
- [Headless setup](https://www.tomshardware.com/reviews/raspberry-pi-headless-setup-how-to,6028.html)
- [Install camera](https://raspberrytips.com/install-camera-raspberry-pi/)

### Update

After the installation, make sure your system is up to date:
```
sudo apt update
sudo apt upgrade
```

### Enable camera

Enable the camera on "**Interfacing options**" -> "**Camera**":
```
sudo raspi-config
```



## Install Node.js

Enable the NodeSource repository by running the following command in your terminal:
```
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt install nodejs
```

### Raspberry PI Zero W

The latest versions of node doesn't provide a armv61 version.
Therefore we need to find the latest node for the armv61 version. 
The latest LTS version for armv61 i could find was v10.24.0. 

```
curl -o node-v10.24.0-linux-armv6l.tar.gz https://nodejs.org/download/release/v10.24.0/node-v10.24.0-linux-armv6l.tar.gz
tar -xzf node-v10.24.0-linux-armv6l.tar.gz
sudo cp -r node-v10.24.0-linux-armv6l/* /usr/local/

sudo reboot
```

Hint to check your arm version:
```
uname -m
```

### Check the node installation
To verify the installation, run the following command to print the installed node version.

```
node --version
```

## Install RaspiCam

### Dependencies

exiv2 is used to extract the thumbnails from the photos.
```
sudo apt install exiv2
```

### RaspiCam


Copy the **build** folder from this repository to your Raspberry PI.

or

Clone the repository and build the package: 

```
git clone https://github.com/Lillifee/raspiCam.git

cd raspiCam/

npm install
npm run build
```

## 

# Start RaspiCam

First you should know the IP address of your raspberry pi.
```
ifconfig wlan0
```

Change to the raspiCam folder and start the server:
```
node build/server.js
```

Wait until the following message appears:

` [server] server listening on 8000 `

Open the browser and navigate to: `http://__ip_address__:8000`









