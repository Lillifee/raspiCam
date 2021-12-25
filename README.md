# 📷 RaspiCam

RaspiCam is a react application to stream, take pictures or record videos from your raspberry pi camera over a web interface. The live stream is provided over a simple HTTP request and displayed using by the brilliant [JMuxer](https://github.com/samirkumardas/jmuxer).

- **Simple**: a mobile-first designed user interface to provide a flawless user experience on the smartphone.
- **Lightweight**: raspiCam uses the build-in raspistill and raspivid to stream, capture and record videos.

## Usecases
- Monitoring camera
- Timelapse photography
- Video recorder
- Camera to go with remote trigger (smartphone)
- Use it as a tool to find the best camera settings for your project.
    - Adjust the settings without manually start and stop the raspivid or raspistill.
    - Copy the result from the terminal and use it for your project.

## Hardware
I'm using a **Raspberry PI Zero W** with a **Raspberry PI HQ camera**.

You can find the 3d printing files on https://www.prusaprinters.org/prints/48519-raspberry-pi-zero-webcam-hq-camera

![picture](screenshots/raspiZeroHqCamera.jpg)

If you prefer a **Raspberry PI4**: 
https://www.prusaprinters.org/prints/61556-raspberry-pi4-hq-camera-aluminium-mix

![picture](screenshots/raspiPi4HqCamera.jpg)

![picture](screenshots/raspiCamSettingsShot2.png)

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

Enable the camera in the raspi-config: "**Interfacing options**" -> "**Camera**":
```
sudo raspi-config
```



## Install Node.js

### Raspberry PI 4

Enable the NodeSource repository by running the following command in your terminal:
```
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt install nodejs
```

### Raspberry PI Zero W

The latest versions of node doesn't provide a armv61 version.
The last LTS version i could find was v10.24.0. 

```
curl -o node-v10.24.0-linux-armv6l.tar.gz https://nodejs.org/download/release/v10.24.0/node-v10.24.0-linux-armv6l.tar.gz
tar -xzf node-v10.24.0-linux-armv6l.tar.gz
sudo cp -r node-v10.24.0-linux-armv6l/* /usr/local/

sudo reboot
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

Download the latest release and extract it to a new raspiCam folder.

```
mkdir raspiCam && cd raspiCam
wget https://github.com/Lillifee/raspiCam/releases/latest/download/raspiCam.tar.gz
tar -xvzf raspiCam.tar.gz
```

<details>
  <summary>Alternative: Clone the repository and build it</summary>
    Clone the repository and build the package: 

    ```
    git clone https://github.com/Lillifee/raspiCam.git

    cd raspiCam/

    npm install
    npm run build
    ```
    The bundled package should appear in the **build** folder.
</details>


## 

# Run RaspiCam

Change to the raspiCam or build folder and start the server:

```
node server.js
```

As soon the server is up and running, the following message appear:

` [server] server listening on 8000 `

Open the browser and navigate to: `http://__ip_address__:8000`

# Run RaspiCam as a service

To automatically start the RaspiCam on startup, you can run the RaspiCam as a service.
Check the [raspicam.service](https://github.com/Lillifee/raspiCam/blob/master/systemd/raspicam.service) in the systemd folder in the repository and adapt it to your needs.

Copy the raspicam.service file to your raspberry and move the raspicam.service configuration file to the systemd:
```
sudo cp raspicam.service /etc/systemd/system
```

Enable and start the raspicam service:
```
sudo systemctl enable raspicam.service
sudo systemctl start raspicam.service
```

If you encounter problems (e.g.: the server doesn't start), check the logs:
```
journalctl -u raspicam
```

Or stop and disable the service:
```
sudo systemctl disable raspicam.service
sudo systemctl stop raspicam.service
```

# Tipps

You can also check the following [article](https://dev.to/bogdaaamn/run-your-nodejs-application-on-a-headless-raspberry-pi-4jnn) to run the raspiCam headless. It includes a step by step instruction for:

- [PM2](https://github.com/Unitech/pm2) - Autostart the process
- [NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) - Reverse proxy to run raspiCam on port 80

# Credits
- [JMuxer](https://github.com/samirkumardas/jmuxer).

# Troubleshooting

**Slow live stream**
- Check the WIFI connection 
- Close the web developer tools
- Increase the quality compensation in the settings

Found a bug? Don't hesitate to create a new issue. 

Please add your running setting to the ticket. 
You can find the latest command sent to raspiCam in the terminal output:

**HINT** If you found the right settings for your project, you can simple copy the command from there.

![picture](screenshots/terminal.png)



# Screenshots

![picture](screenshots/raspiCamSettingsShot1.png)

![picture](screenshots/raspiCamSettingsShot2.png)

![picture](screenshots/raspiCamSettingsShot3.png)

![picture](screenshots/raspiCamSettingsShot4.png)

![picture](screenshots/raspiCamSettingsShot5.png)

![picture](screenshots/raspiCamSettingsShot6.png)

# Theme

![picture](screenshots/raspiCamTheme1.png)

![picture](screenshots/raspiCamTheme2.png)

# Roadmap and ideas

## Stream
 - Investigate MJPEG stream
    - Stream could be used for other applications e.g. Octoprint

## Settings
 - Search settings
 - Setting explanation 

## Gallery
 - sort order
 - loading indication
 - support videos
 - group timelapse photos
 - select and delete items
 - download multiple items (zip)

## Keywords
jmuxer live player node.js raspberry pi stream h264 monitoring timelapse video recording capture raspivid raspistill raspicam
