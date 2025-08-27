#include "NativeTurboFilter.h"
#include <jsi/jsi.h>

namespace facebook::react {
    NativeTurboFilter::NativeTurboFilter(std::shared_ptr<CallInvoker> jsInvoker)
        : TurboModule(kModuleName, std::move(jsInvoker)) {
            // Constructor implementation
        }

        jsi::Value NativeTurboFilter::get(jsi::Runtime& rt, const jsi::PropNameID& propName) {
            auto name = propName.utf8(rt);
            
            if (name == "filterArray") {
                return jsi::Function::createFromHostFunction(
                    rt,
                    propName,
                    2, // number of parameters
                    [this](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
                        if (count < 2) {
                            throw jsi::JSError(rt, "filterArray expects 2 arguments");
                        }
                        
                        if (!arguments[0].isObject() || !arguments[1].isObject()) {
                            throw jsi::JSError(rt, "filterArray expects two objects as arguments");
                        }
                        
                        jsi::Object dataObject = arguments[0].asObject(rt);
                        jsi::Object filterCriteria = arguments[1].asObject(rt);
                        
                        return filterArray(rt, dataObject, filterCriteria);
                    }
                );
            }
            
            return TurboModule::get(rt, propName);
        }

        jsi::Array NativeTurboFilter::filterArray(
            jsi::Runtime& rt,
            const jsi::Object& dataObject,
            const jsi::Object& filterCriteria) {
            
            // Create a result array
            jsi::Array resultArray(rt, 0);
            size_t resultIndex = 0;
            
            // Get all property names from the filter criteria
            jsi::Array filterKeys = filterCriteria.getPropertyNames(rt);
            size_t filterKeyCount = filterKeys.size(rt);
            
            // Get all property names from the data object
            jsi::Array dataKeys = dataObject.getPropertyNames(rt);
            size_t dataKeyCount = dataKeys.size(rt);
            
            // Check each property in the data object
            for (size_t i = 0; i < dataKeyCount; i++) {
                jsi::Value dataKeyValue = dataKeys.getValueAtIndex(rt, i);
                if (!dataKeyValue.isString()) {
                    continue;
                }
                
                std::string dataKey = dataKeyValue.asString(rt).utf8(rt);
                jsi::PropNameID dataPropName = jsi::PropNameID::forUtf8(rt, dataKey);
                jsi::Value currentItem = dataObject.getProperty(rt, dataPropName);
                
                // Skip if current item is not an object
                if (!currentItem.isObject()) {
                    continue;
                }
                
                jsi::Object currentObject = currentItem.asObject(rt);
                bool matchesAllFilters = true;
                
                // Check if the current object matches all filter criteria
                for (size_t j = 0; j < filterKeyCount; j++) {
                    jsi::Value filterKeyValue = filterKeys.getValueAtIndex(rt, j);
                    if (!filterKeyValue.isString()) {
                        continue;
                    }
                    
                    std::string filterKey = filterKeyValue.asString(rt).utf8(rt);
                    jsi::PropNameID filterPropName = jsi::PropNameID::forUtf8(rt, filterKey);
                    
                    // Get the expected value from filter criteria
                    jsi::Value expectedValue = filterCriteria.getProperty(rt, filterPropName);
                    
                    // Check if the current object has this property
                    if (!currentObject.hasProperty(rt, filterPropName)) {
                        matchesAllFilters = false;
                        break;
                    }
                    
                    // Get the actual value from the current object
                    jsi::Value actualValue = currentObject.getProperty(rt, filterPropName);
                    
                    // Compare values based on type
                    bool valuesMatch = false;
                    if (expectedValue.isString() && actualValue.isString()) {
                        valuesMatch = expectedValue.asString(rt).utf8(rt) == actualValue.asString(rt).utf8(rt);
                    } else if (expectedValue.isNumber() && actualValue.isNumber()) {
                        valuesMatch = expectedValue.asNumber() == actualValue.asNumber();
                    } else if (expectedValue.isBool() && actualValue.isBool()) {
                        valuesMatch = expectedValue.asBool() == actualValue.asBool();
                    }
                    
                    if (!valuesMatch) {
                        matchesAllFilters = false;
                        break;
                    }
                }
                
                // If the object matches all filters, add it to the result
                if (matchesAllFilters) {
                    // Resize the result array to accommodate the new element
                    jsi::Array newResultArray(rt, resultIndex + 1);
                    
                    // Copy existing elements
                    for (size_t k = 0; k < resultIndex; k++) {
                        newResultArray.setValueAtIndex(rt, k, resultArray.getValueAtIndex(rt, k));
                    }
                    
                    // Add the new element
                    newResultArray.setValueAtIndex(rt, resultIndex, std::move(currentItem));
                    resultArray = std::move(newResultArray);
                    resultIndex++;
                }
            }
            
            return resultArray;
        }
}