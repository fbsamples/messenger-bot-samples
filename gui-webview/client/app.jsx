/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/react-in-jsx-scope */

/* =============================================
   =                   Setup                   =
   ============================================= */

/* ----------  External Libraries  ---------- */

import React from 'react';
import 'whatwg-fetch';

/* ----------  External UI Kit  ---------- */

import {
  Button,
  ButtonArea,
  CellBody,
  CellFooter,
  CellHeader,
  CellsTitle,
  Form,
  FormCell,
  Slider,
  Switch,
} from 'react-weui';

/* ----------  Internal Components  ---------- */

import ArrivalPeriod from './arrival-period.jsx';
import Environment from './environment.jsx';
import GiftCategory from './gift-category.jsx';
import Loading from './loading.jsx';
import SkinType from './skin-type.jsx';

/* ----------  Helpers  ---------- */

import WebviewControls from '../messenger-api-helpers/webview-controls';
import {dateString} from '../utils/date-string-format';

/* ----------  Models  ---------- */

import Gift from '../models/gift';
import User from '../models/user';

const {ENVIRONMENTS} = User;

/* =============================================
   =            React Application              =
   ============================================= */

export default class App extends React.PureComponent {

  /* =============================================
     =               Configuration               =
     ============================================= */

  /* ----------  Top-level App Constants  ---------- */

  static dateConfig = {
    month: 'long',
    day: 'numeric',
  }

  /**
   * Keeping the display labels in the front end as a separation of concerns
   * The actual values are being imported later via static attributes on
   * the models
   *
   * We have introduced an ordering dependency, but this is also the order that
   * we wish to display the options in the UI.
   */

  static giftCategories = [
    {
      title: 'Moisturizers',
      subtitle: 'Daily moisturizers & night creams',
      image: 'moisturizers-filtered-cropped.jpg',
    },
    {
      title: 'Cleansers',
      subtitle: 'Face washes, wipes & exfoliators',
      image: 'cleansers-filtered-cropped.jpg',
    },
    {
      title: 'Masks',
      subtitle: 'Face & sheet masks',
      image: 'masks-filtered-cropped.jpg',
    },
    {
      title: 'Lip Treatments',
      subtitle: 'Balms & sunscreen',
      image: 'lip-treatments-filtered-cropped.jpg',
    },
  ]

  static skinTypes = [
    'Acne or blemishes',
    'Oiliness',
    'Loss of tone',
    'Wrinkles',
    'Sensitivity',
    'Dehydration (tight with oil)',
    'Dryness (flaky with no oil)',
    'Scars',
  ]

  static arrivalPeriods = [
    'Last 30 days',
    'Last 60 days',
    'Coming soon',
  ]

  /* ----------  React Configuration  ---------- */

  static propTypes = {
    userId: React.PropTypes.string.isRequired,
  }

  state = {
    dateOfBirth: null,
    giftCategory: null,
    arrivalPeriod: null,
    environment: null,
    skinTypes: [],
    persist: true,
  }

  /* =============================================
     =               Helper Methods              =
     ============================================= */

  /* ----------  Communicate with Server  ---------- */

  /**
   * Pull saved data from the server, and populate the form
   * If there's an error, we log it to the console. Errors will not be availble
   * within the Messenger webview. If you need to see them 'live', switch to
   * an `alert()`.
   *
   * @returns {undefined}
   */
  pullData() {
    const endpoint = `/users/${this.props.userId}`;
    console.log(`Pulling data from ${endpoint}...`);

    fetch(endpoint)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }

        console.error(
          status,
          `Unable to fetch user data for User ${this.props.userId}'`
        );
      }).then((jsonResponse) => {
        console.log(`Data fetched successfully: ${jsonResponse}`);

        this.setState({
          ...jsonResponse,
          skinTypes: new Set(jsonResponse.skinTypes),
        });
      }).catch((err) => console.error('Error pulling data', err));
  }

  pushData() {
    const content = this.jsonState();
    console.log(`Push data: ${content}`);

    fetch(`/users/${this.props.userId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: content,
    }).then((response) => {
      if (response.ok) {
        console.log('Data successfully updated on the server!');
        return;
      }

      console.error(
        response.status,
        `Unable to save user data for User ${this.props.userId}'`
      );
    }).catch((err) => console.error('Error pushing data', err)).then(() => {
      WebviewControls.close();
    });
  }

  /* ----------  Formatters  ---------- */

  // Format state for easy printing or transmission
  jsonState() {
    return JSON.stringify({
      ...this.state,
      skinTypes: [...this.state.skinTypes],
    });
  }

  /* ----------  State Handlers  ---------- */

  setGiftCategory(giftCategory) {
    console.log(`Gift Category: ${giftCategory}`);
    this.setState({giftCategory});
  }

  setArrivalPeriod(arrivalPeriod) {
    console.log(`Arrival Period: ${arrivalPeriod}`);
    this.setState({arrivalPeriod});
  }

  setEnvironment(envIndex) {
    const environment = ENVIRONMENTS[envIndex];
    console.log(`Environment: ${environment}`);
    this.setState({environment});
  }

  addSkinType(type) {
    console.log(`Add skin type: ${type}`);
    const oldSkinTypes = this.state.skinTypes;
    const skinTypes = new Set(oldSkinTypes);
    skinTypes.add(type);
    this.setState({skinTypes});
  }

  removeSkinType(type) {
    console.log(`Remove skin type: ${type}`);
    const oldSkinTypes = this.state.skinTypes;
    const skinTypes = new Set(oldSkinTypes);
    skinTypes.delete(type);
    this.setState({skinTypes});
  }

  setPersist(persist) {
    console.log(`Persist: ${JSON.stringify(persist)}`);
    this.setState({persist});
  }

  setDateOfBirth(dateOfBirth) {
    console.log(`Set date of birth: ${dateOfBirth}`);
    this.setState({dateOfBirth});
  }

  /* =============================================
     =              React Lifecycle              =
     ============================================= */

  componentWillMount() {
    this.pullData(); // Initial data fetch
  }

  /*
   * Provide the main structure of the resulting HTML
   * Delegates items out to specialized components
   *
   */
  render() {
    /**
     * If waiting for data, just show the loading spinner
     * and skip the rest of this function
     */
    if (!this.state.giftCategory) {
      return <Loading />;
    }

    /* ----------  Setup Sections (anything dynamic or repeated) ---------- */

    const skinTypes = App.skinTypes.map((label, index) => {
      const value = User.SKIN_TYPES[index];
      const checked = this.state.skinTypes.has(value);

      return (
        <SkinType
          key={value}
          value={value}
          label={label}
          checked={checked}
          addSkinType={this.addSkinType.bind(this)}
          removeSkinType={this.removeSkinType.bind(this)}
        />
      );
    });

    const giftCategories =
      App.giftCategories.map(({title, subtitle, image}, index) => {
        const value = Gift.CATEGORIES[index];

        return (
          <GiftCategory
            key={value}
            title={title}
            subtitle={subtitle}
            image={image}
            selected={value === this.state.giftCategory}
            setGiftCategory={() => this.setGiftCategory(value)}
          />
        );
      });

    const arrivalPeriods = App.arrivalPeriods.map((label, index) => {
      const value = User.ARRIVAL_PERIODS[index];
      return (
        <ArrivalPeriod
          key={label}
          label={label}
          value={value}
          selected={value === this.state.arrivalPeriod}
          setArrivalPeriod={this.setArrivalPeriod.bind(this)}
        />
      );
    });

    const environments = User.ENVIRONMENTS.map((label) => {
      return (
        <Environment
          key={label}
          label={label}
          active={label === this.state.environment}
        />
      );
    });

    const {persist} = this.state;
    const persistSwitch = (
      <Switch
        defaultChecked={persist}
        onClick={() => this.setPersist(!persist)}
      />
    );

    /* ----------  Main Structure  ---------- */

    return (
      <div className='app'>
        <section>
          <CellsTitle>Date of Birth</CellsTitle>
          <Form>
            <FormCell select id='date-of-birth'>
              <CellHeader id='display-date'>
                {dateString(this.state.dateOfBirth, true)}
              </CellHeader>

              <CellBody>
                <input
                  id='datepicker'
                  type='date'
                  required='required'
                  value={this.state.dateOfBirth}
                  onChange={(event) => this.setDateOfBirth(event.target.value)}
                />
              </CellBody>
            </FormCell>
          </Form>
        </section>

        <section>
          <CellsTitle>Preferred Gift Type</CellsTitle>
          <Form radio id='gift-type'>{giftCategories}</Form>
        </section>

        <section>
          <CellsTitle>What is your current environment like?</CellsTitle>
          <div id='env-slider'>
            <Slider
              min={0}
              max={2}
              step={1}
              defaultValue={ENVIRONMENTS.indexOf(this.state.environment)}
              showValue={false}
              onChange={this.setEnvironment.bind(this)}
            />
            {environments}
          </div>
        </section>

        <section>
          <CellsTitle>What are your top skin concerns?</CellsTitle>
          <Form checkbox>{skinTypes}</Form>
        </section>

        <section id='arrival-periods'>
          <CellsTitle>New Arrivals</CellsTitle>
          <Form radio id='arrivalPeriod'>{arrivalPeriods}</Form>
        </section>

        <section>
          <Form>
            <FormCell switch>
              <CellBody>Save this info for next time</CellBody>
              <CellFooter>{persistSwitch}</CellFooter>
            </FormCell>
          </Form>
        </section>
        <ButtonArea className='see-options'>
          <Button onClick={() => this.pushData()}>See Gift Options</Button>
        </ButtonArea>
      </div>
    );
  }
}
