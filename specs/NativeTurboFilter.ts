import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  filterArray(dataObject: Object, filterCriteria: Object): Array<Object> | null;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    "NativeTurboFilter"
);