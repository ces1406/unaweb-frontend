import React from "react";
import { LINK_YOUTUBE, LINK_FACEBOOK, LINK_TWITTER } from "../globals";
import twitter from '../../static_files/imgs/icons/twitter.svg';
import facebook from '../../static_files/imgs/icons/facebook.svg';
import youtube from '../../static_files/imgs/icons/youtube.svg';

export default class Footer extends React.Component {
  render() {
    return (
      <ul className="pie">
        <li>
          <a href={LINK_TWITTER} className="ml-3 pb-0 pt-0" target='_blank'>
            <img src={twitter} className='icono-1'/>
          </a>
        </li>
        <li>
          <a href={LINK_YOUTUBE} className="ml-3 pb-0 pt-0" target='_blank'>
            <img src={youtube} className='icono-1'/>
          </a>
        </li>
        <li>
          <a href={LINK_FACEBOOK} className="ml-3 pb-0 pt-0" target='_blank'>
            <img src={facebook} className='icono-1'/>
          </a>
        </li>
      </ul>
    );
  }
}
