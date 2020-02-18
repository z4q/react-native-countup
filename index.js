import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AppState
} from 'react-native';
import _ from 'lodash';
import {sprintf} from 'sprintf-js';

const DEFAULT_DIGIT_STYLE = {backgroundColor: '#FFFFFF'};
const DEFAULT_DIGIT_TXT_STYLE = {color: '#000'};
const DEFAULT_TIME_LABEL_STYLE = {color: '#000'};
const DEFAULT_SEPARATOR_STYLE = {color: '#000'};
const DEFAULT_TIME_TO_SHOW = ['D', 'H', 'M', 'S'];
const DEFAULT_TIME_LABELS = {
  d: 'Days',
  h: 'Hours',
  m: 'Minutes',
  s: 'Seconds',
};

class CountUp extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    digitStyle: PropTypes.object,
    digitTxtStyle: PropTypes.object,
    timeLabelStyle: PropTypes.object,
    separatorStyle: PropTypes.object,
    timeToShow: PropTypes.array,
    showSeparator: PropTypes.bool,
    size: PropTypes.number,
    max: PropTypes.number,
    current: PropTypes.number,
    onChange: PropTypes.func,
    onPress: PropTypes.func,
    onFinish: PropTypes.func
  };

  state = {
    current: Math.max(this.props.current, 0),
    lastCurrent: null,
    max: Math.max(this.props.max, 0),
    wentBackgroundAt: null
  };

  constructor(props) {
    super(props);
    this.timer = setInterval(this.updateTimer, 1000);
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

   static getDerivedStateFromProps(nextProps, prevProps) {
    if (prevProps.current !== nextProps.current) {
      return {
        lastCurrent: prevProps.current,
        current: Math.max(nextProps.current, 0)
      };
    }
    else return null;
  }

  _handleAppStateChange = currentAppState => {
    const { current, wentBackgroundAt } = this.state;
    if (
      currentAppState === "active" &&
      wentBackgroundAt &&
      this.props.running
    ) {
      const diff = (Date.now() - wentBackgroundAt) / 1000.0;
      this.setState({
        lastCurrent: current,
        current: Math.max(0, current + diff)
      });
    }
    if (currentAppState === "background") {
      this.setState({ wentBackgroundAt: Date.now() });
    }
  };

  getTimeLeft = () => {
    const { current } = this.state;
    return {
      seconds: current % 60,
      minutes: parseInt(current / 60, 10) % 60,
      hours: parseInt(current / (60 * 60), 10) % 24,
      days: parseInt(current / (60 * 60 * 24), 10)
    };
  };

  updateTimer = () => {
    const { lastCurrent, current, max } = this.state;

    if (lastCurrent === current || !this.props.running) {
      return;
    }
    if (
      current === max - 1 ||
      (current === max && lastCurrent !== max - 1)
    ) {
      if (this.props.onFinish) {
        this.props.onFinish();
      }
      if (this.props.onChange) {
        this.props.onChange(current);
      }
    }

    if (current === max) {
      this.setState({ lastCurrent: max, current: max });
    } else {
      if (this.props.onChange) {
        this.props.onChange(current);
      }
      this.setState({
        lastCurrent: current,
        current: Math.max(0, current + 1)
      });
    }
  };

  renderDigit = d => {
    const { digitStyle, digitTxtStyle, size } = this.props;
    return (
      <View
        style={[
          styles.digitCont,
          digitStyle,
          { width: size * 2.3, height: size * 2.6 }
        ]}
      >
        <Text style={[styles.digitTxt, { fontSize: size }, digitTxtStyle]}>
          {d}
        </Text>
      </View>
    );
  };

  renderLabel = label => {
    const { timeLabelStyle, size } = this.props;
    if (label) {
      return (
        <Text
          style={[styles.timeTxt, { fontSize: size / 1.8 }, timeLabelStyle]}
        >
          {label}
        </Text>
      );
    }
  };

  renderDoubleDigits = (label, digits) => {
    return (
      <View style={styles.doubleDigitCont}>
        <View style={styles.timeInnerCont}>{this.renderDigit(digits)}</View>
        {this.renderLabel(label)}
      </View>
    );
  };

  renderSeparator = () => {
    const { separatorStyle, size } = this.props;
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text
          style={[
            styles.separatorTxt,
            { fontSize: size * 1.2 },
            separatorStyle
          ]}
        >
          {":"}
        </Text>
      </View>
    );
  };

  renderCountUp = () => {
    const { timeToShow, timeLabels, showSeparator } = this.props;
    const { current } = this.state;
    const { days, hours, minutes, seconds } = this.getTimeLeft();
    const newTime = sprintf(
      "%02d:%02d:%02d:%02d",
      days,
      hours,
      minutes,
      seconds
    ).split(":");
    const Component = this.props.onPress ? TouchableOpacity : View;

    return (
      <Component style={styles.timeCont} onPress={this.props.onPress}>
        {timeToShow.includes("D")
          ? this.renderDoubleDigits(timeLabels.d, newTime[0])
          : null}
        {showSeparator && timeToShow.includes("D") && timeToShow.includes("H")
          ? this.renderSeparator()
          : null}
        {timeToShow.includes("H")
          ? this.renderDoubleDigits(timeLabels.h, newTime[1])
          : null}
        {showSeparator && timeToShow.includes("H") && timeToShow.includes("M")
          ? this.renderSeparator()
          : null}
        {timeToShow.includes("M")
          ? this.renderDoubleDigits(timeLabels.m, newTime[2])
          : null}
        {showSeparator && timeToShow.includes("M") && timeToShow.includes("S")
          ? this.renderSeparator()
          : null}
        {timeToShow.includes("S")
          ? this.renderDoubleDigits(timeLabels.s, newTime[3])
          : null}
      </Component>
    );
  };

  render() {
    return <View style={this.props.style}>{this.renderCountUp()}</View>;
  }
}

CountUp.defaultProps = {
  digitStyle: DEFAULT_DIGIT_STYLE,
  digitTxtStyle: DEFAULT_DIGIT_TXT_STYLE,
  timeLabelStyle: DEFAULT_TIME_LABEL_STYLE,
  timeLabels: DEFAULT_TIME_LABELS,
  separatorStyle: DEFAULT_SEPARATOR_STYLE,
  timeToShow: DEFAULT_TIME_TO_SHOW,
  showSeparator: false,
  current: 0,
  max: 100000,
  size: 15,
  running: true,
};

const styles = StyleSheet.create({
  timeCont: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeTxt: {
    color: 'white',
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
  timeInnerCont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitCont: {
    borderRadius: 5,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubleDigitCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums']
  },
  separatorTxt: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
});

module.exports = CountUp;
