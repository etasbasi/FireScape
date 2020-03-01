import React from "react";
import Carousel, { Dots } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

import FlameImg from "./assets/flame.png";

const sites = [
  "https://ualr.edu/safety/home/fire-safety/what-to-do-in-case-of-a-fire/",
  "https://www.bbc.com/news/world-australia-50951043",
  "https://www.bbc.com/news/science-environment-51590080"
];

class News extends React.Component {
  constructor() {
    super();
    this.state = { value: 0 };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <>
        <div className="container">
          <h1>News</h1>
        </div>
        <Carousel
          value={this.state.value}
          onChange={this.onChange}
          slides={sites.map(site => (
            <iframe src={site} title="site"></iframe>
          ))}
          arrows
          clickToChange
        />
      </>
    );
  }
}

export default News;
