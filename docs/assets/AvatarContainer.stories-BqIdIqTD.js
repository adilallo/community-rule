import{j as s}from"./jsx-runtime-C_nHp4yK.js";import{A as e}from"./AvatarContainer-Bt0G0TWZ.js";import{A as a}from"./Avatar-C4Vb3oYl.js";import"./iframe-D_aMTKb2.js";import"./preload-helper-DIZFD4sK.js";const g={title:"Components/AvatarContainer",component:e,parameters:{layout:"centered",docs:{description:{component:"A container component that groups multiple avatars together with overlapping spacing. Useful for displaying multiple users or team members in a compact format."}}},argTypes:{size:{control:{type:"select"},options:["small","medium","large","xlarge"],description:"The size of the avatar container and its children"},className:{control:{type:"text"},description:"Additional CSS classes"}},tags:["autodocs"]},t={args:{size:"medium"},render:r=>s.jsxs(e,{...r,children:[s.jsx(a,{size:r.size,src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:r.size,src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:r.size,src:"assets/Avatar_3.png",alt:"User 3"})]})},n={args:{},render:()=>s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"text-white font-semibold mb-3",children:"Small Size"}),s.jsxs(e,{size:"small",children:[s.jsx(a,{size:"small",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"small",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"small",src:"assets/Avatar_3.png",alt:"User 3"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"text-white font-semibold mb-3",children:"Medium Size"}),s.jsxs(e,{size:"medium",children:[s.jsx(a,{size:"medium",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"medium",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"medium",src:"assets/Avatar_3.png",alt:"User 3"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"text-white font-semibold mb-3",children:"Large Size"}),s.jsxs(e,{size:"large",children:[s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"large",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"large",src:"assets/Avatar_3.png",alt:"User 3"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"text-white font-semibold mb-3",children:"XLarge Size"}),s.jsxs(e,{size:"xlarge",children:[s.jsx(a,{size:"xlarge",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"xlarge",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"xlarge",src:"assets/Avatar_3.png",alt:"User 3"})]})]})]}),parameters:{docs:{description:{story:"Different size variants of the avatar container with overlapping spacing."}}}},i={args:{},render:()=>s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"text-white font-semibold mb-3",children:"2 Users"}),s.jsxs(e,{size:"large",children:[s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"large",src:"assets/Avatar_2.png",alt:"User 2"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"text-white font-semibold mb-3",children:"3 Users"}),s.jsxs(e,{size:"large",children:[s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"large",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"large",src:"assets/Avatar_3.png",alt:"User 3"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"text-white font-semibold mb-3",children:"4 Users"}),s.jsxs(e,{size:"large",children:[s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"large",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"large",src:"assets/Avatar_3.png",alt:"User 3"}),s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 4"})]})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"text-white font-semibold mb-3",children:"5 Users"}),s.jsxs(e,{size:"large",children:[s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"large",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"large",src:"assets/Avatar_3.png",alt:"User 3"}),s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 4"}),s.jsx(a,{size:"large",src:"assets/Avatar_2.png",alt:"User 5"})]})]})]}),parameters:{docs:{description:{story:"Avatar containers with different numbers of users to show the overlapping effect."}}}},l={args:{},render:()=>s.jsx("div",{className:"min-h-screen bg-[var(--color-surface-default-primary)] p-8",children:s.jsxs("div",{className:"max-w-4xl mx-auto",children:[s.jsx("h2",{className:"text-white font-semibold mb-6",children:"Avatar Container in Context"}),s.jsxs("div",{className:"space-y-8",children:[s.jsxs("div",{className:"bg-[var(--color-surface-default-secondary)] p-6 rounded-lg",children:[s.jsx("h3",{className:"text-white font-semibold mb-4",children:"Team Members"}),s.jsxs("div",{className:"flex items-center space-x-4",children:[s.jsxs(e,{size:"medium",children:[s.jsx(a,{size:"medium",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"medium",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"medium",src:"assets/Avatar_3.png",alt:"User 3"})]}),s.jsx("span",{className:"text-white",children:"3 team members"})]})]}),s.jsxs("div",{className:"bg-[var(--color-surface-default-secondary)] p-6 rounded-lg",children:[s.jsx("h3",{className:"text-white font-semibold mb-4",children:"Project Contributors"}),s.jsxs("div",{className:"flex items-center space-x-4",children:[s.jsxs(e,{size:"large",children:[s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"large",src:"assets/Avatar_2.png",alt:"User 2"}),s.jsx(a,{size:"large",src:"assets/Avatar_3.png",alt:"User 3"}),s.jsx(a,{size:"large",src:"assets/Avatar_1.png",alt:"User 4"})]}),s.jsx("span",{className:"text-white",children:"4 contributors"})]})]}),s.jsxs("div",{className:"bg-[var(--color-surface-default-secondary)] p-6 rounded-lg",children:[s.jsx("h3",{className:"text-white font-semibold mb-4",children:"Small Team"}),s.jsxs("div",{className:"flex items-center space-x-4",children:[s.jsxs(e,{size:"small",children:[s.jsx(a,{size:"small",src:"assets/Avatar_1.png",alt:"User 1"}),s.jsx(a,{size:"small",src:"assets/Avatar_2.png",alt:"User 2"})]}),s.jsx("span",{className:"text-white",children:"2 members"})]})]})]})]})}),parameters:{docs:{description:{story:"Avatar containers used in realistic contexts to show how they integrate with other UI elements."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    size: "medium"
  },
  render: args => <AvatarContainer {...args}>
              <Avatar size={args.size} src="assets/Avatar_1.png" alt="User 1" />
        <Avatar size={args.size} src="assets/Avatar_2.png" alt="User 2" />
        <Avatar size={args.size} src="assets/Avatar_3.png" alt="User 3" />
    </AvatarContainer>
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Small Size</h3>
        <AvatarContainer size="small">
          <Avatar size="small" src="assets/Avatar_1.png" alt="User 1" />
          <Avatar size="small" src="assets/Avatar_2.png" alt="User 2" />
          <Avatar size="small" src="assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Medium Size</h3>
        <AvatarContainer size="medium">
          <Avatar size="medium" src="assets/Avatar_1.png" alt="User 1" />
          <Avatar size="medium" src="assets/Avatar_2.png" alt="User 2" />
          <Avatar size="medium" src="assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Large Size</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">XLarge Size</h3>
        <AvatarContainer size="xlarge">
          <Avatar size="xlarge" src="assets/Avatar_1.png" alt="User 1" />
          <Avatar size="xlarge" src="assets/Avatar_2.png" alt="User 2" />
          <Avatar size="xlarge" src="assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different size variants of the avatar container with overlapping spacing."
      }
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">2 Users</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="assets/Avatar_2.png" alt="User 2" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">3 Users</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">4 Users</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="assets/Avatar_3.png" alt="User 3" />
          <Avatar size="large" src="assets/Avatar_1.png" alt="User 4" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">5 Users</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="assets/Avatar_3.png" alt="User 3" />
          <Avatar size="large" src="assets/Avatar_1.png" alt="User 4" />
          <Avatar size="large" src="assets/Avatar_2.png" alt="User 5" />
        </AvatarContainer>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Avatar containers with different numbers of users to show the overlapping effect."
      }
    }
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Avatar Container in Context
        </h2>

        <div className="space-y-8">
          <div className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Team Members</h3>
            <div className="flex items-center space-x-4">
              <AvatarContainer size="medium">
                <Avatar size="medium" src="assets/Avatar_1.png" alt="User 1" />
                <Avatar size="medium" src="assets/Avatar_2.png" alt="User 2" />
                <Avatar size="medium" src="assets/Avatar_3.png" alt="User 3" />
              </AvatarContainer>
              <span className="text-white">3 team members</span>
            </div>
          </div>

          <div className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">
              Project Contributors
            </h3>
            <div className="flex items-center space-x-4">
              <AvatarContainer size="large">
                <Avatar size="large" src="assets/Avatar_1.png" alt="User 1" />
                <Avatar size="large" src="assets/Avatar_2.png" alt="User 2" />
                <Avatar size="large" src="assets/Avatar_3.png" alt="User 3" />
                <Avatar size="large" src="assets/Avatar_1.png" alt="User 4" />
              </AvatarContainer>
              <span className="text-white">4 contributors</span>
            </div>
          </div>

          <div className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Small Team</h3>
            <div className="flex items-center space-x-4">
              <AvatarContainer size="small">
                <Avatar size="small" src="assets/Avatar_1.png" alt="User 1" />
                <Avatar size="small" src="assets/Avatar_2.png" alt="User 2" />
              </AvatarContainer>
              <span className="text-white">2 members</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Avatar containers used in realistic contexts to show how they integrate with other UI elements."
      }
    }
  }
}`,...l.parameters?.docs?.source}}};const p=["Default","Sizes","DifferentGroupSizes","InContext"];export{t as Default,i as DifferentGroupSizes,l as InContext,n as Sizes,p as __namedExportsOrder,g as default};
