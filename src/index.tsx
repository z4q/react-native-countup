import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AppState,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { format } from 'date-fns';

interface Props {
  id?: string;
  style?: StyleProp<ViewStyle>;
  digitStyle?: StyleProp<ViewStyle>;
  digitTxtStyle?: StyleProp<TextStyle>;
  timeLabelStyle?: StyleProp<TextStyle>;
  separatorStyle?: StyleProp<TextStyle>;
  size?: number;
  max?: number;
  current?: number;
  onChange?: (current: number) => void;
  onPress?: () => void;
  onFinish?: () => void;
  timeToShow?: Array<'D' | 'H' | 'M' | 'S'>;
  timeLabels?: { [key in 'd' | 'h' | 'm' | 's']?: string };
  showSeparator?: boolean;
  running?: boolean;
}

const DEFAULT_DIGIT_STYLE = { backgroundColor: '#FFFFFF' };
const DEFAULT_DIGIT_TXT_STYLE = { color: '#000' };
const DEFAULT_TIME_LABEL_STYLE = { color: '#000' };
const DEFAULT_SEPARATOR_STYLE = { color: '#000' };
const DEFAULT_TIME_TO_SHOW: Array<'D' | 'H' | 'M' | 'S'> = ['D', 'H', 'M', 'S'];
const DEFAULT_TIME_LABELS = {
  d: 'Days',
  h: 'Hours',
  m: 'Minutes',
  s: 'Seconds',
};

const CountUp: React.FC<Props> = ({
  id,
  style,
  digitStyle = DEFAULT_DIGIT_STYLE,
  digitTxtStyle = DEFAULT_DIGIT_TXT_STYLE,
  timeLabelStyle = DEFAULT_TIME_LABEL_STYLE,
  separatorStyle = DEFAULT_SEPARATOR_STYLE,
  size = 15,
  max = 100000,
  current: initialCurrent = 0,
  onChange,
  onPress,
  onFinish,
  timeToShow = DEFAULT_TIME_TO_SHOW,
  timeLabels = DEFAULT_TIME_LABELS,
  showSeparator = false,
  running = true,
}) => {
  const [current, setCurrent] = useState<number>(Math.max(initialCurrent, 0));
  const [lastCurrent, setLastCurrent] = useState<number | null>(null);
  const [wentBackgroundAt, setWentBackgroundAt] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  useEffect(() => {
    const handleAppStateChange = (currentAppState: string) => {
      if (
        currentAppState === 'active' &&
        wentBackgroundAt &&
        running
      ) {
        const diff = (Date.now() - wentBackgroundAt) / 1000.0;
        setLastCurrent(current);
        setCurrent(prevCurrent => Math.max(0, prevCurrent + diff));
      }
      if (currentAppState === 'background') {
        setWentBackgroundAt(Date.now());
      }
    };

    // Use type assertion to cast AppState to any if AppStateStatic is not recognized
    (AppState as any).addEventListener('change', handleAppStateChange);

    return () => {
      (AppState as any).removeEventListener('change', handleAppStateChange);
    };
  }, [wentBackgroundAt, running, current]);

  const getTimeLeft = useCallback(() => {
    const seconds = current % 60;
    const minutes = Math.floor((current / 60) % 60);
    const hours = Math.floor((current / (60 * 60)) % 24);
    const days = Math.floor(current / (60 * 60 * 24));

    return { days, hours, minutes, seconds };
  }, [current]);

  const updateTimer = useCallback(() => {
    if (lastCurrent === current || !running) {
      return;
    }

    if (current === max - 1 || (current === max && lastCurrent !== max - 1)) {
      if (onFinish) onFinish();
      if (onChange) onChange(current);
    }

    if (current === max) {
      setLastCurrent(max);
      setCurrent(max);
    } else {
      if (onChange) onChange(current);
      setLastCurrent(current);
      setCurrent(Math.max(0, current + 1));
    }
  }, [current, lastCurrent, max, onChange, onFinish, running]);

  const renderDigit = (d: string) => (
    <View
      style={[
        styles.digitCont,
        digitStyle,
        { width: size ? size * 2.3 : undefined, height: size ? size * 2.6 : undefined },
      ]}
    >
      <Text style={[styles.digitTxt, { fontSize: size }, digitTxtStyle]}>
        {d}
      </Text>
    </View>
  );

  const renderLabel = (label: string) => (
    label ? (
      <Text
        style={[styles.timeTxt, { fontSize: size ? size / 1.8 : undefined }, timeLabelStyle]}
      >
        {label}
      </Text>
    ) : null
  );

  const renderDoubleDigits = (label: string, digits: string) => (
    <View style={styles.doubleDigitCont}>
      <View style={styles.timeInnerCont}>{renderDigit(digits)}</View>
      {renderLabel(label)}
    </View>
  );

  const renderSeparator = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={[
          styles.separatorTxt,
          { fontSize: size ? size * 1.2 : undefined },
          separatorStyle,
        ]}
      >
        {':'}
      </Text>
    </View>
  );

  // Define ComponentToUse as any type to handle conditional rendering based on onPress
  const ComponentToUse: any = onPress ? TouchableOpacity : View;

  const renderCountUp = () => {
    const { days, hours, minutes, seconds } = getTimeLeft();
    const newTime = format(new Date(0, 0, days, hours, minutes, seconds), 'dd:HH:mm:ss').split(':');

    return (
      <ComponentToUse style={styles.timeCont} onPress={onPress}>
        {timeToShow.includes('D') && renderDoubleDigits(timeLabels.d || '', newTime[0])}
        {showSeparator && timeToShow.includes('D') && timeToShow.includes('H') && renderSeparator()}
        {timeToShow.includes('H') && renderDoubleDigits(timeLabels.h || '', newTime[1])}
        {showSeparator && timeToShow.includes('H') && timeToShow.includes('M') && renderSeparator()}
        {timeToShow.includes('M') && renderDoubleDigits(timeLabels.m || '', newTime[2])}
        {showSeparator && timeToShow.includes('M') && timeToShow.includes('S') && renderSeparator()}
        {timeToShow.includes('S') && renderDoubleDigits(timeLabels.s || '', newTime[3])}
      </ComponentToUse>
    );
  };

  return <View style={style}>{renderCountUp()}</View>;
};

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
    fontVariant: ['tabular-nums'],
  },
  separatorTxt: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
});

export default CountUp;
