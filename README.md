# react-native-countup
React Native Countup

## Installation
Run `npm install react-native-countup-component --save` OR `yarn add react-native-countup-component --save`

## Props
| Name | Description | Type | Default Value |
| :--- | :----- | :--- | :---: |
| id | Counter id, to determine whether to reset the counter or not | string | null |
| style | Override the component style | object | {} |
| digitStyle |  Digit style | object | {backgroundColor: ![#FFFFFF](https://placehold.it/15/FFFFFF/000000?text=+) `'#FFFFFF'`} |
| digitTxtStyle | Digit Text style | object | {color: ![#FAB913](https://placehold.it/15/000000/000000?text=+) `'#000'`} |
| timeLabelStyle | Time Label style | object | {color: ![#FAB913](https://placehold.it/15/000000/000000?text=+) `'#000'`} |
| separatorStyle | Separator style | object | {color: ![#FAB913](https://placehold.it/15/000000/000000?text=+) `'#000'`} |
| size | Size of the countup component | number | 15 |
| current | Number of seconds to start countup | number | 0 |
| max | Number of seconds to stop countup | number | 0 |
| onFinish | What function should be invoked when the time is equal to max | func | null |
| onChange | What function should be invoked when the timer is changing | func | null |
| onPress | What function should be invoked when clicking on the timer | func | null |
| timeToShow | What Digits to show | array | ['D', 'H', 'M', 'S'] |
| timeLabels | Text to show in time label | object | {d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds'} |
| showSeparator | Should show separator | bool | false |
| running | a boolean to pause and resume the component | bool | true |
