#pragma once

#include <ReactCommon/TurboModule.h>
#include <jsi/jsi.h>

#include <memory>
#include <string>

namespace facebook::react {
    class NativeTurboFilter : public TurboModule {
    public:
        static constexpr auto kModuleName = "NativeTurboFilter";
        
        NativeTurboFilter(std::shared_ptr<CallInvoker> jsInvoker);

        // Override the get method to expose functions to JavaScript
        jsi::Value get(jsi::Runtime& rt, const jsi::PropNameID& propName) override;

        // Implement the filterArray method
        jsi::Array filterArray(
            jsi::Runtime& rt,
            const jsi::Object& dataObject,
            const jsi::Object& filterCriteria);
    };
}