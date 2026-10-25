const fs = require('fs');
const path = require('path');

const filesToPatch = [
  {
    filePath: path.join(__dirname, '..', 'node_modules', 'expo-notifications', 'build', 'TopicSubscriptionModule.android.js'),
    content: `import { requireNativeModule } from 'expo-modules-core';

let mod;
try {
  mod = requireNativeModule('ExpoTopicSubscriptionModule');
} catch (e) {
  mod = {
    addListener: () => {},
    removeListeners: () => {},
    subscribeToTopicAsync: () => Promise.resolve(null),
    unsubscribeFromTopicAsync: () => Promise.resolve(null),
  };
}

export default mod;
`
  },
  {
    filePath: path.join(__dirname, '..', 'node_modules', 'expo-notifications', 'build', 'ServerRegistrationModule.native.js'),
    content: `import { requireNativeModule } from 'expo-modules-core';

let mod;
try {
  mod = requireNativeModule('NotificationsServerRegistrationModule');
} catch (e) {
  mod = {
    addListener: () => {},
    removeListeners: () => {},
  };
}

export default mod;
`
  },
  {
    filePath: path.join(__dirname, '..', 'node_modules', 'expo-notifications', 'build', 'BackgroundNotificationTasksModule.native.js'),
    content: `import { requireNativeModule } from 'expo-modules-core';

let mod;
try {
  mod = requireNativeModule('ExpoBackgroundNotificationTasksModule');
} catch (e) {
  mod = {
    async registerTaskAsync(taskName) {
      return null;
    },
    async unregisterTaskAsync(taskName) {
      return null;
    },
  };
}

export default mod;
`
  }
];

for (const { filePath, content } of filesToPatch) {
  try {
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Patched for Expo Go compatibility:', path.relative(process.cwd(), filePath));
    }
  } catch (err) {
    console.warn('Could not patch:', filePath, err.message);
  }
}
