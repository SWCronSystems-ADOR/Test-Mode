import React, { Component } from 'react';
import axios from 'axios';
import './Hooter.css';

const api = window.location.hostname;
const port = '5000';

export class Hooter extends Component {
    constructor(props) {
        super(props);
        this.hooterData = '';
        this.selectedDevice = undefined;
        this.hooterStates = {};
        this.map = '';
        this.state = {
          hooterNames: [],
          UI_State: false, //will control whether test is aleady active somewhere else, then the other person will see a warning sign
          active: false, //this will handle text of 'Master-Activator' button
          map: ''
        }
        this.interval = undefined;
    }

    //will clean memory once component unmounts
    componentCleaner = () => {
      if(this.state.UI_State !== false)
      {
        clearInterval(this.interval);
        axios.get(`http://${api}:${port}/off_test_mode`);
      }
    }

    componentDidMount = () => {
      document.title = 'TEST MODE';

      window.addEventListener('beforeunload', this.componentCleaner);

      axios.get(`http://${api}:${port}/config/`)
      .then((res) => {
        this.setState({ map: res.data.map })
      })

      axios.post(`http://${api}:${port}/on_test_mode/`)
      .then((res) => {
        if(res.data === false)
        {
          if(this.state.UI_State !== false)
          {
            this.setState(() => {
              return {
                UI_State: false
              }
            })
          }
        }
        else {
          this.hooterData = res.data;
          let temp = Object.keys(this.hooterData);
          let temp2 = temp.map((item, index) => {
              return (
                  <button 
                      key={item.toString()}
                      onClick={this.handleHooterClick}
                      id={item.replace(/\s+/g, '')}
                      className={this.hooterData[`${item}`].status ? "buttons" : "inactive"}
                  >
                      {item}
                  </button>
              )
          })
          this.setState(() => {
              return {
                  UI_State: true,
                  hooterNames: temp2
              }
          })
        }
      })
      .catch((err) => console.log(err));


    }

    handleHooterClick = (e) => {
      e.persist();
      console.log('handle hooter clicked')
        if(this.selectedDevice === undefined)
        {
            this.selectedDevice = e.target.innerText.toLowerCase();
            document.querySelector(`#${this.selectedDevice.replace(/\s+/g, '')}`).classList.add('selected');
            let svgObjectTag = document.querySelector('#map-object');
            let svg = svgObjectTag.contentDocument;
            let hooters = svg.querySelectorAll(`#${this.selectedDevice.replace(/\s+/g, '')}`);

            if(hooters)
            {
              let i = 0;
              while(i < hooters.length)
              {
                console.log(hooters[i])
                console.log(hooters[i].children)
                if(hooters[i] && hooters[i].children)
                {
                  for(let j = 0; j < hooters[i].children.length; j++)
                  {
                    hooters[i].children[j].style.transition = "all 0.3s linear";
                    hooters[i].children[j].setAttribute("fill", "rgba(208, 204, 44, 1)");
                  }
                }
                
                i++;
              }

              if(!document.querySelector(`.Right-Panel`).classList.contains("showRightSide"))
              {
                document.querySelector(`.Right-Panel`).classList.add("showRightSide");
              }
            }


            // if(hooters)
            // {
            //   for(let i = 0; i < hooters.children.length; i++)
            //   {
            //     hooters.children[i].style.transition = "all 0.3s linear";
            //     hooters.children[i].setAttribute("fill", "rgba(208,204,44, 1)")
            //   }

            //   if(!document.querySelector(`.Right-Panel`).classList.contains("showRightSide"))
            //   {
            //     document.querySelector(`.Right-Panel`).classList.add("showRightSide");
            //   }
            // }
        }
        else {
            document.querySelector(`#${this.selectedDevice.replace(/\s+/g, '')}`).classList.remove('selected');
            let svgObjectTag = document.querySelector('#map-object');
            let svg = svgObjectTag.contentDocument;

            let hooters = svg.querySelectorAll(`#${this.selectedDevice.replace(/\s+/g, '')}`);


            let i = 0;
            while(i < hooters.length)
            {
              console.log(hooters[i])
              console.log(hooters[i].children)
              if(hooters[i] && hooters[i].children)
              {
                for(let j = 0; j < hooters[i].children.length; j++)
                {
                  hooters[i].children[j].style.transition = "all 0.3s linear";
                  hooters[i].children[j].setAttribute("fill", "aqua");
                }
              }
              
              i++;
            }
            
              // if(hooter)
              // {
              //   for(let i = 0; i < hooter.children.length; i++)
              //   {
              //     hooter.children[i].style.transition = "all 0.3s linear";
              //     hooter.children[i].setAttribute("fill", "aqua")
              //   }
              // }
              

              this.selectedDevice = e.target.innerText.toLowerCase();
              if(Object.keys(this.hooterStates).length === 0)
              {
                
                document.querySelector(`#${this.selectedDevice.replace(/\s+/g, '')}`).classList.add('selected');
                hooters = svg.querySelectorAll(`#${this.selectedDevice.replace(/\s+/g, '')}`);
                let i = 0;
                while(i < hooters.length)
                {
                  console.log(hooters[i])
                  console.log(hooters[i].children)
                  if(hooters[i] && hooters[i].children)
                  {
                    for(let j = 0; j < hooters[i].children.length; j++)
                    {
                      hooters[i].children[j].style.transition = "all 0.3s linear";
                      hooters[i].children[j].setAttribute("fill", "rgba(208,204,44, 1)");
                    }
                  }
                  
                  i++;
                }
                // if(hooters)
                // {
                //   for(let i = 0; i < hooter.children.length; i++)
                //   {
                //     hooter.children[i].style.transition = "all 0.3s linear";
                //     hooter.children[i].setAttribute("fill", "rgba(208,204,44, 1)")
                //   }
                // }
              }
              else if(Object.keys(this.hooterStates).length > 0)
              {
                if(!this.hooterStates[`${this.selectedDevice}`])
                {
                  document.querySelector(`#${this.selectedDevice.replace(/\s+/g, '')}`).classList.add('selected');
                  hooters = svg.querySelectorAll(`#${this.selectedDevice.replace(/\s+/g, '')}`);

                  let i = 0;
                  while(i < hooters.length)
                  {
                    console.log(hooters[i])
                    console.log(hooters[i].children)
                    if(hooters[i] && hooters[i].children)
                    {
                      for(let j = 0; j < hooters[i].children.length; j++)
                      {
                        hooters[i].children[j].style.transition = "all 0.3s linear";
                        hooters[i].children[j].setAttribute("fill", "rgba(208,204,44, 1)");
                      }
                    }
                    
                    i++;
                  }
                  // if(hooter)
                  // {
                  //   for(let i = 0; i < hooter.children.length; i++)
                  //   {
                  //     hooter.children[i].style.transition = "all 0.3s linear";
                  //     hooter.children[i].setAttribute("fill", "rgba(208,204,44, 1)")
                  //   }
                  // }
                }
              }
        }
    }

    handleHooterStatus = (e) => {
        if(this.selectedDevice)
        {
            if(e.target.innerText === "ON")
            {
                let temp = this.hooterData[`${this.selectedDevice}`].on_command;
                axios.get(`${temp}`)
                .then((res) => {
                  this.hooterStates[`${this.selectedDevice}`] = res.data;
                  document.querySelector(`#${this.selectedDevice.replace(/\s+/g, '')}`).classList.remove("selected");
                  document.querySelector(`#${this.selectedDevice.replace(/\s+/g, '')}`).classList.add("active");
                })
                .catch((err) => console.log(err))
            }
            else if(e.target.innerText === "OFF")
            {
              
              let temp = this.hooterData[`${this.selectedDevice}`].off_command
                axios.get(`${temp}`)
                .then((res) => {
                  this.hooterStates[`${this.selectedDevice}`] = res.data;
                  document.querySelector(`#${this.selectedDevice.replace(/\s+/g, '')}`).classList.remove("active");
                  document.querySelector(`#${this.selectedDevice.replace(/\s+/g, '')}`).classList.add("selected");
                })
                .catch((err) => console.log(err))
            }
        }
        else {
            alert('Please Select A Device First');
        }
    }

    blinker = () => {
      let keys = Object.keys(this.hooterStates);
      keys.forEach((item) => {
        //if state is true
        if(this.hooterStates[`${item}`])
        {
          let svgObjectTag = document.querySelector('#map-object');
          let svg = svgObjectTag.contentDocument;
          // let hooter = svg.querySelector(`#${item.replace(/\s+/g, '')}`);
          let hooters = svg.querySelectorAll(`#${item.replace(/\s+/g, '')}`);

          if(hooters)
          {
            //light red

            let i = 0;
            while(i < hooters.length)
            {
              console.log(hooters[i])
              console.log(hooters[i].children)
              if(hooters[i] && hooters[i].children)
              {
                for(let j = 0; j < hooters[i].children.length; j++)
                {
                  hooters[i].children[j].style.transition = "all 0.3s linear";
                  hooters[i].children[j].setAttribute("fill", "rgba(255, 0, 0, 1)");
                }
              }
              
              i++;
            }



            // for(let i = 0; i < hooter.children.length; i++)
            // {
            //   hooter.children[i].style.transition = "all 0.5s linear";
            //   hooter.children[i].setAttribute("fill", "rgb(255, 0, 0)");
            // }

            //dark red
            setTimeout(() => {

              let i = 0;
              while(i < hooters.length)
              {
                if(hooters[i] && hooters[i].children)
                {
                  for(let j = 0; j < hooters[i].children.length; j++)
                  {
                    hooters[i].children[j].style.transition = "all 0.3s linear";
                    hooters[i].children[j].setAttribute("fill", "rgba(139, 0, 0, 1)");
                  }
                }
                
                i++;
              }


              // for(let i = 0; i < hooter.children.length; i++)
              // {
              //   hooter.children[i].style.transition = "all 0.5s linear";
              //   hooter.children[i].setAttribute("fill", "rgb(139, 0, 0)");
              // }
            }, 600)
          }
        }
        else if(!this.hooterStates[`${item}`])
        {
          let svgObjectTag = document.querySelector('#map-object');
          let svg = svgObjectTag.contentDocument;
          let hooters = svg.querySelectorAll(`#${item.replace(/\s+/g, '')}`);
          if(item === this.selectedDevice && hooters)
          {
            let i = 0;
            while(i < hooters.length)
            {
              if(hooters[i] && hooters[i].children)
              {
                for(let j = 0; j < hooters[i].children.length; j++)
                {
                  hooters[i].children[j].style.transition = "all 0.3s linear";
                  hooters[i].children[j].setAttribute("fill", "rgba(208,204,44, 1)");
                }
              }
              
              i++;
            }
            // for(let i = 0; i < hooter.children.length; i++)
            // {
            //   hooter.children[i].style.transition = "all 0.5s linear";
            //   hooter.children[i].setAttribute("fill", "rgba(208,204,44, 1)");
            // }
          }
          else
          {
            if(hooters)
            {
              let i = 0;
              while(i < hooters.length)
              {
                if(hooters[i] && hooters[i].children)
                {
                  for(let j = 0; j < hooters[i].children.length; j++)
                  {
                    hooters[i].children[j].style.transition = "all 0.3s linear";
                    hooters[i].children[j].setAttribute("fill", "aqua");
                  }
                }
                
                i++;
              }
              // for(let i = 0; i < hooter.children.length; i++)
              // {
              //   hooter.children[i].style.transition = "all 0.5s linear";
              //   hooter.children[i].setAttribute("fill", "aqua");
              // }
            }
          }
          
        }
      })
    }

    togglePanels = () => {
      let target1 = document.querySelector('.Left-Panel');
      let target2 = document.querySelector('.Right-Panel');
      let target3 = document.querySelector('#Master-Activator');

      if(target1.classList.contains("showLeftSide"))
      {
        target1.classList.remove("showLeftSide");
        target3.classList.remove("openMaster-Activator");
      }
      else {
        target1.classList.add("showLeftSide");
        target3.classList.add("openMaster-Activator");
      }

      if(target2.classList.contains("showRightSide"))
      {
        target2.classList.remove("showRightSide");
      }
      else if(!target2.classList.contains("showRightSide") && this.selectedDevice)
      {
        target2.classList.add("showRightSide");
      }
    }

    componentWillUnmount = () => {
      this.componentCleaner();
      window.removeEventListener('beforeunload', this.componentCleaner);
    }

    activateAll = () => {
      if(this.state.active === false)
      {
        let devices = Object.keys(this.hooterData);
        devices.forEach((device, index) => {
          if(this.hooterData[`${device}`].status)
          {
            let api = this.hooterData[`${device}`].on_command;
            setTimeout(() => {
              axios.get(`${api}`)
              .then((res) => {
                this.hooterStates[`${device}`] = res.data;
                document.querySelector(`#${device.replace(/\s+/g, '')}`).classList.add('active');
              }).catch((err) => {
                setTimeout(() => {
                  
                  axios.get(`${api}`).then((res) => {
                    console.log('switch on error hiit', device)
                    this.hooterStates[`${device}`] = res.data;
                    document.querySelector(`#${device.replace(/\s+/g, '')}`).classList.add('active');
                  })
                }, 500 * index)
              });
            }, 100 * index)
          }
        })

        this.setState({ active: true });
      }
      else if(this.state.active === true)
      {
        let devices = Object.keys(this.hooterData);
        devices.forEach((device, index) => {
          let api = this.hooterData[`${device}`].off_command;
          setTimeout(() => {
            axios.get(`${api}`)
            .then((res) => {
              this.hooterStates[`${device}`] = res.data;
              document.querySelector(`#${device.replace(/\s+/g, '')}`).classList.remove('active');
            }).catch((err) => {
              setTimeout(() => {
                
                axios.get(`${api}`).then((res) => {
                  console.log('switch off error hit', device)
                  this.hooterStates[`${device}`] = res.data;
                  document.querySelector(`#${device.replace(/\s+/g, '')}`).classList.remove('active');
                })
              }, 500 * index)
            });
          }, 100 * index)
        })
        this.setState({ active: false })
      }
    }

    render() {
      this.interval = setInterval(() => {
        this.blinker();
      }, 1200)

      return (
          <div className="Hooter">
            {this.state.UI_State ? 
              <>
                <object
                id="map-object"
                aria-label="background-image"
                data={this.state.map}
                type="image/svg+xml"
                width={(window.innerWidth) - 10 + 'px'}
                height={(window.innerHeight - 10) + 'px'} />

                <button className="hootersButton buttons" onClick={this.togglePanels}>
                  [&nbsp;<span style={{transform:"none",color:"#d36d70",display:"contents"}}>M</span>&nbsp;] TEST MODE
                </button>

                <button id="Master-Activator" className="buttons" onClick={this.activateAll}>
                  {this.state.active ? 'SWITCH OFF ALL DEVICES' : 'SWITCH ON ALL DEVICES'}
                </button>

                <div className="Left-Panel LeftSide">
                    {this.state.hooterNames}
                </div>

                <div 
                    className="Right-Panel RightSide">
                        <button id="On-Button" className="buttons" onClick={this.handleHooterStatus}>ON</button>
                        <button id="Off-Button" className="buttons" onClick={this.handleHooterStatus}>OFF</button>
                </div>
              </>
              :
              <h2 style={{
                textAlign: "center"
              }}>
                TEST MODE ALREADY ACTIVE ELSEWHERE. ONLY ONE SESSION ALLOWED AT A TIME
              </h2>
            }
          </div>
      )
    }
}

export default Hooter;
