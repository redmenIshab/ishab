import React, { Component } from "react";
import Particles from "react-particles-js";

export default class Header extends Component {
     handleDownload() {
      const link = document.createElement("a");
      link.href = "../../../cv.pdf";
      link.download = "Redmen_CV.pdf";
      link.click();
  }

  render() {
    let resumeData = this.props.resumeData;
    return (
      <React.Fragment>
        {/*generated code*/}
        <header id={"home"}>
          <nav id="nav-wrap">
            <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
              Show navigation
            </a>
            <a className="mobile-btn" href="#" title="Hide navigation">
              Hide navigation
            </a>
            <ul id="nav" className="nav">
              <li>
              <button onClick={()=>this.handleDownload()}>
                Download CV
              </button>
               </li>
              <li className="current">
                <a className="smoothscroll" href="#home">
                  Home
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#about">
                  About
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#resume">
                  Resume
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#portfolio">
                  Works
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#testimonials">
                  Testimonials
                </a>
              </li>
              <li>
                <a className="smoothscroll" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="row banner">
            <div className="banner-text">
              <h1 className="responsive-headline">I am {resumeData.name}.</h1>
              <h3>
                 {resumeData.role}.{resumeData.roleDescription}
              </h3>
              <hr />
              <ul className="social">
                {resumeData.socialLinks &&
                  resumeData.socialLinks.map(item => {
                    return (
                      <li key={item.name}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <i className={item.className} />
                        </a>
                      </li>
                    );
                  })}
              </ul>

            </div>
          </div>

          <p className="scrolldown">
            <a className="smoothscroll" href="#about">
              <i className="icon-down-circle" />
            </a>
          </p>
        </header>
        <Particles
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            // zIndex: "-10",
            top: "0",
            left: "0"
          }}
          height={696}
          width={2560}
          params={
            {
              // polygon: {
              //   enable: true,
              //   type: "inside",
              //   move: {
              //     radius: 10
              //   },
              //   url: "../../../public/images/loader.gif"
              // }
            }
          }
        />
      </React.Fragment>
    );
  }
}
