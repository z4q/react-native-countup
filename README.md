# react-native-countup

**React Native Countup Component**

## Installation

Install via npm:

```bash
npm install react-native-countup-component --save
```
Or using yarn:
```bash
yarn add react-native-countup-component --save
```

| Name           | Description                                 | Type                                                                       | Default Value                    |
|----------------|---------------------------------------------|----------------------------------------------------------------------------|----------------------------------|
| id             | Counter id, used to determine reset behavior | string \| undefined                                                        | undefined                        |
| style          | Custom styles for the component              | StyleProp<ViewStyle>                                                       | {}                               |
| digitStyle     | Style for the digits                         | StyleProp<ViewStyle>                                                       | {backgroundColor: '#FFFFFF'}      |
| digitTxtStyle  | Style for the digit text                     | StyleProp<TextStyle>                                                       | {color: '#000'}                  |
| timeLabelStyle | Style for the time label                     | StyleProp<TextStyle>                                                       | {color: '#000'}                  |
| separatorStyle | Style for the separator                      | StyleProp<TextStyle>                                                       | {color: '#000'}                  |
| size           | Size of the countup component                | number                                                                     | 15                               |
| current        | Initial count in seconds                     | number                                                                     | 0                                |
| max            | Maximum count in seconds                     | number                                                                     | 0                                |
| onFinish       | Function to call when count reaches max      | (() => void) \| undefined                                                  | undefined                        |
| onChange       | Function to call when count changes          | ((count: number) => void) \| undefined                                      | undefined                        |
| onPress        | Function to call when component is pressed   | (() => void) \| undefined                                                  | undefined                        |
| timeToShow     | Array specifying which digits to display     | string[]                                                                   | ['D', 'H', 'M', 'S']              |
| timeLabels     | Labels for each time unit                    | { d?: string, h?: string, m?: string, s?: string }                          | { d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' } |
| showSeparator  | Whether to display separators between digits | boolean                                                                    | false                            |
| running        | Controls whether the component is running    | boolean                                                                    | true                             |


### Explanation:

1. **TypeScript Types**: Props are annotated with TypeScript types (`StyleProp<ViewStyle>`, `StyleProp<TextStyle>`, etc.) to indicate the expected structure and types.

2. **Optional Props**: Props like `id`, `onFinish`, `onChange`, and `onPress` are marked as optional (`undefined` in TypeScript) if not always required.

3. **Default Values**: Default values are specified for each prop where applicable, providing clarity on what values are used if not provided.

4. **Enhanced Descriptions**: Descriptions are concise yet clear, ensuring developers understand the purpose and usage of each prop.

This TypeScript-enhanced README will help developers integrate and use `react-native-countup` effectively in their TypeScript projects, ensuring type safety and clarity in prop usage.
