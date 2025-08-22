import{j as e}from"./jsx-runtime-C_nHp4yK.js";import{L as s}from"./Logo-DM7O8ATg.js";import"./iframe-D_aMTKb2.js";import"./preload-helper-DIZFD4sK.js";const h={title:"Components/Logo",component:s,parameters:{layout:"centered",docs:{description:{component:"The CommunityRule logo component with multiple size variants for different contexts (header, footer, home header). Can display with or without text and adapts colors based on context."}}},argTypes:{size:{control:{type:"select"},options:["default","homeHeaderXsmall","homeHeaderSm","homeHeaderMd","homeHeaderLg","homeHeaderXl","header","headerMd","headerLg","headerXl","footer","footerLg"],description:"The size variant of the logo"},showText:{control:{type:"boolean"},description:"Whether to show the text portion of the logo"}},tags:["autodocs"]},t={args:{size:"default",showText:!0}},n={args:{showText:!0},render:a=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Default Sizes"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(s,{...a,size:"default"}),e.jsx(s,{...a,size:"header"}),e.jsx(s,{...a,size:"footer"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Header Sizes"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(s,{...a,size:"header"}),e.jsx(s,{...a,size:"headerMd"}),e.jsx(s,{...a,size:"headerLg"}),e.jsx(s,{...a,size:"headerXl"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Home Header Sizes"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(s,{...a,size:"homeHeaderXsmall"}),e.jsx(s,{...a,size:"homeHeaderSm"}),e.jsx(s,{...a,size:"homeHeaderMd"}),e.jsx(s,{...a,size:"homeHeaderLg"}),e.jsx(s,{...a,size:"homeHeaderXl"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Footer Sizes"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(s,{...a,size:"footer"}),e.jsx(s,{...a,size:"footerLg"})]})]})]}),parameters:{docs:{description:{story:"Different size variants available for the logo component across different contexts."}}}},r={args:{size:"default",showText:!1},render:a=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Icon Only - Default Sizes"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(s,{...a,size:"default"}),e.jsx(s,{...a,size:"header"}),e.jsx(s,{...a,size:"footer"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Icon Only - Header Sizes"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(s,{...a,size:"header"}),e.jsx(s,{...a,size:"headerMd"}),e.jsx(s,{...a,size:"headerLg"}),e.jsx(s,{...a,size:"headerXl"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-white font-semibold mb-3",children:"Icon Only - Home Header Sizes"}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(s,{...a,size:"homeHeaderXsmall"}),e.jsx(s,{...a,size:"homeHeaderSm"}),e.jsx(s,{...a,size:"homeHeaderMd"}),e.jsx(s,{...a,size:"homeHeaderLg"}),e.jsx(s,{...a,size:"homeHeaderXl"})]})]})]}),parameters:{docs:{description:{story:"Logo variants with only the icon, no text. Useful for compact spaces."}}}},i={args:{},render:()=>e.jsx("div",{className:"min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)] p-8",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h2",{className:"text-white font-semibold mb-6",children:"Home Header Context (White Text)"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"XSmall:"}),e.jsx(s,{size:"homeHeaderXsmall"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"Small:"}),e.jsx(s,{size:"homeHeaderSm"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"Medium:"}),e.jsx(s,{size:"homeHeaderMd"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"Large:"}),e.jsx(s,{size:"homeHeaderLg"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"XLarge:"}),e.jsx(s,{size:"homeHeaderXl"})]})]})]})}),parameters:{docs:{description:{story:"Home header context showing white text variants. These are used on dark/transparent backgrounds."}}}},o={args:{},render:()=>e.jsx("div",{className:"min-h-screen bg-[var(--color-surface-default-primary)] p-8",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h2",{className:"text-white font-semibold mb-6",children:"Header Context (Dark Text)"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"Default:"}),e.jsx(s,{size:"header"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"Medium:"}),e.jsx(s,{size:"headerMd"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"Large:"}),e.jsx(s,{size:"headerLg"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"XLarge:"}),e.jsx(s,{size:"headerXl"})]})]})]})}),parameters:{docs:{description:{story:"Header context showing dark text variants. These are used on light backgrounds."}}}},d={args:{},render:()=>e.jsx("div",{className:"min-h-screen bg-[var(--color-surface-default-primary)] p-8",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h2",{className:"text-white font-semibold mb-6",children:"Footer Context (Larger Sizes)"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"Default:"}),e.jsx(s,{size:"footer"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("span",{className:"text-white text-sm w-24",children:"Large:"}),e.jsx(s,{size:"footerLg"})]})]})]})}),parameters:{docs:{description:{story:"Footer context showing larger size variants for footer placement."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    size: "default",
    showText: true
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    showText: true
  },
  render: args => <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Default Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="default" />
          <Logo {...args} size="header" />
          <Logo {...args} size="footer" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Header Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="header" />
          <Logo {...args} size="headerMd" />
          <Logo {...args} size="headerLg" />
          <Logo {...args} size="headerXl" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Home Header Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="homeHeaderXsmall" />
          <Logo {...args} size="homeHeaderSm" />
          <Logo {...args} size="homeHeaderMd" />
          <Logo {...args} size="homeHeaderLg" />
          <Logo {...args} size="homeHeaderXl" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Footer Sizes</h3>
        <div className="space-x-4">
          <Logo {...args} size="footer" />
          <Logo {...args} size="footerLg" />
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different size variants available for the logo component across different contexts."
      }
    }
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    size: "default",
    showText: false
  },
  render: args => <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">
          Icon Only - Default Sizes
        </h3>
        <div className="space-x-4">
          <Logo {...args} size="default" />
          <Logo {...args} size="header" />
          <Logo {...args} size="footer" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">
          Icon Only - Header Sizes
        </h3>
        <div className="space-x-4">
          <Logo {...args} size="header" />
          <Logo {...args} size="headerMd" />
          <Logo {...args} size="headerLg" />
          <Logo {...args} size="headerXl" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">
          Icon Only - Home Header Sizes
        </h3>
        <div className="space-x-4">
          <Logo {...args} size="homeHeaderXsmall" />
          <Logo {...args} size="homeHeaderSm" />
          <Logo {...args} size="homeHeaderMd" />
          <Logo {...args} size="homeHeaderLg" />
          <Logo {...args} size="homeHeaderXl" />
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Logo variants with only the icon, no text. Useful for compact spaces."
      }
    }
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Home Header Context (White Text)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">XSmall:</span>
            <Logo size="homeHeaderXsmall" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Small:</span>
            <Logo size="homeHeaderSm" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Medium:</span>
            <Logo size="homeHeaderMd" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Large:</span>
            <Logo size="homeHeaderLg" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">XLarge:</span>
            <Logo size="homeHeaderXl" />
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Home header context showing white text variants. These are used on dark/transparent backgrounds."
      }
    }
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Header Context (Dark Text)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Default:</span>
            <Logo size="header" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Medium:</span>
            <Logo size="headerMd" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Large:</span>
            <Logo size="headerLg" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">XLarge:</span>
            <Logo size="headerXl" />
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Header context showing dark text variants. These are used on light backgrounds."
      }
    }
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Footer Context (Larger Sizes)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Default:</span>
            <Logo size="footer" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm w-24">Large:</span>
            <Logo size="footerLg" />
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Footer context showing larger size variants for footer placement."
      }
    }
  }
}`,...d.parameters?.docs?.source}}};const p=["Default","Sizes","IconOnly","HomeHeaderContext","HeaderContext","FooterContext"];export{t as Default,d as FooterContext,o as HeaderContext,i as HomeHeaderContext,r as IconOnly,n as Sizes,p as __namedExportsOrder,h as default};
