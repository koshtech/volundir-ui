
# Volundir




# Volundir App Framework

**Volundir AF** is a lightweight and agnostic Vanilla JS framework designed to provide a Rails-style JavaScript application development experience.

Volundir uses adapters to provide, connect, and manage interface components, storage systems, hardware devices, and more. You can run Volundir on pure HTML and limited hostings because it is designed to require no dependencies, installations, or permissions. This makes Volundir agnostic to hosting, interface, storage, and everything else.

Volundir is a set of components that can be used together to deliver the best experience for developers. Currently, Volundir is planned to be composed of:

- **Volundir-UI** – A lightweight CSS + JS framework
- **Volundir-App** – A lightweight and agnostic Vanilla JS framework
- **volundir-depot** - The Volundir Depot System, a repository of Volundir components
- **Volundir-Rails** – A dynamic Volundir backend using Rails (requires a Rails hosting)
- **Volundir-Laravel** – A dynamic Volundir backend using Laravel (requires a Laravel hosting)
- **Volundir-Static** – Tools and scripts to improve static usage of Volundir (requires FTP or SSH access)

---

# Volundir UI Framework

Volundir UI is a lightweight CSS + JS framework designed for clean layouts and modular components. It provides a modern foundation using Flexbox layout and includes prebuilt utilities, forms, buttons, cards, modals, and more.

## Another Framework?

It depends on how you evaluate or use our tools. As shown above, this is a complete solution covering three entirely different environments, offering a development environment for modern interfaces and SPA/PWA applications, compatible with what developers are already used to on the backend.

I didn't think about how it would be distributed or how others would use it. This is my approach to solving problems—tailored to the needs of my team, partners, and clients.

I found in this model the perfect solution for beginners and developers who are not deeply experienced in interface development. Most people know only a little JavaScript—just enough to use `if` statements, `alert`, and maybe a bit of jQuery. Meanwhile, the market demands Angular, React, Vue.js, and others—each with major version incompatibilities that affect code, design, syntax, parameters, method names, and class names. Updating a frontend becomes a nightmare. In fact, most people avoid it.

But that’s okay! Applications must evolve. Change is normal. However, if the original developer doesn't keep up with these changes, they won’t be able to use the latest version of the tools they once chose. Syntax changes, filenames change, rules change, parameters are renamed or translated—traps everywhere.

Volundir aims to keep everything working—regardless of the version, timing, or method of implementation. Even if Volundir changes drastically in the future and looks nothing like it does today, these projects exist in large part to ensure that an application built on version 1.0 will still work correctly when updated directly to version 30—provided that the update guides available at the time are followed.

And those updates likely won’t involve your actual code. They’ll likely be limited to configuration or the addition of components necessary to maintain compatibility.

Personally, I think it’s a technological bottleneck not being able to simply upgrade. I do this with my operating system—why shouldn't I be able to do the same with my framework?

**Well, I can! Because I use Volundir.**

## Why "Volundir"?

Volundir is named after **Volundr (or Wayland the Smith)** — a legendary blacksmith in Norse mythology renowned for crafting divine weapons and artifacts of great power. His tale is one of unmatched skill and fierce vengeance against betrayal.

In the manga *Shuumatsu no Valkyrie*, "Volundr" refers to the sacred ritual in which a valkyrie merges her soul with a human, becoming a divine weapon tailored to that soul's strength.

This framework adopts the name **Volundir** to reflect that same spirit of craftsmanship, transformation, and precision — offering developers a powerful foundation to forge their own applications with elegance and control.


## Getting Started

We use RVM (https://rvm.io/rvm/install) for Ruby scripts.
You can skip next step if you alredy have RVM installed.

### install RVM

Read complete RVM install guide: https://rvm.io/rvm/install

#### Install GPG keys:

As a first step install GPG keys used to verify installation package:

```
gpg --keyserver keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
```

#### Optinal progress bar:

For a progress bar when downloading RVM / Rubies:


```
echo progress-bar >> ~/.curlrc
```

 #### Install RVM stable with ruby:

```
\curl -sSL https://get.rvm.io | bash -s stable
```

 You may load RVM with the following command:

```
source ~/.rvm/scripts/rvm
```

### Volundir Setup

Clone project and enter in created folder:

```
git clone git@github.com:koshtech/volundir-ui.git
cd volundir-ui/
```

Install required Ruby version. The RVM will show you a install command line. Run it:


```
rvm install "ruby-3.4.31"
```

Run blunder:


```
bundle install
```

### Running Volundir

Start the development Ruby web server:


```
bin/volundir s
```

Now, just open http://127.0.0.1:3020/ in your browser.

## File Structure

```

```


## Log System

Log message levels (or severity levels) are used to categorize the importance and impact of events occurring in a system or application. This helps developers and administrators filter and analyze relevant information.

Below is a description of each requested type:

```
INFO (Information): Used for messages that highlight the normal and expected progress of the application. These are routine events, such as the start or end of a task, a user logging in, or a successful operation. They are generally useful for high-level monitoring.
```

```
NOTICE (Warning/Notification): Similar to INFO, but generally indicates significant events that do not represent an immediate error or problem. It can be used to notify about conditions that deserve attention, but that the system can handle without intervention.
```

```
WARN (Warning/Alert): Indicates the occurrence of a potentially harmful or unexpected event that does not prevent the correct execution of the application at the moment. Examples include the use of an obsolete resource, a resource nearing its limit, or a temporary connection failure that will be automatically retried. ERROR: Used to record problems or failures that occurred and prevented the completion of a specific operation or task. The application or part of it may continue to function, but the action in question failed. Requires investigation to understand the root cause and prevent recurrence.
```

```
FATAL: The highest severity level. Indicates a very serious error that caused (or will cause) the total interruption of the application, service, or system. The system can no longer operate reliably or continue execution.
```

```
DEBUGGING: Contains detailed information, generally useful only for developers during the development or troubleshooting phase (debugging). Includes specific technical details, such as variable values, function calls, and execution steps, which would be excessive in a normal production environment.
```

```
SUCCESS: Confirms that an operation was completed successfully.
```

```
ACTIVITY: Describes the message flow and interaction with external resources.
```

### What the logs record

Who accessed the system and when: Records who logged in and at what time.

Actions performed: Documents which files were opened and what changes were made. Events and processes: Keeps a record of all operations and events that occurred.

Descriptive data: Includes contextual information, such as date and time stamps, to assist in incident analysis.

### Purposes of logs

#### Diagnosis and monitoring

Help identify problems and track system performance.

#### Security

Allow monitoring of suspicious activities and protection of the network against threats.

#### Compliance

Essential to meet regulatory requirements in various sectors.

#### Incident analysis

Provide a detailed record of actions prior to an incident to assist in investigating the cause.

#### Performance optimization

Help identify bottlenecks and improve system efficiency.

---

## Troubleshooting

### Unexpected Load Errors:

 Problem: Your Volundir System is working fine. But, after you create a new module/controller/model or any other component, the system crashes showing some error message like this in console and/or system logs:

  [Coordinator][loadModule] Error loading object:  devices  error:  TypeError: Cannot create property 'resolved' on boolean 'false' (object_coordinator.js:251)
    at ObjectCoordinator.updateDependencies (object_coordinator.js:221:29)
    at ObjectCoordinator.loadObject (object_coordinator.js:243:36)
    at async RouterModule.processControllerAction (21395c51-a079-40dc-84f2-f9f6b474d0c3:136:33)
    at async RouterModule.executeInternalAction (21395c51-a079-40dc-84f2-f9f6b474d0c3:100:19)


   Error explanation: In the above example, a new created controller causes an error in the `ObjectCoordinator.updateDependencies`, caused by a syntax error in index action:

```
     index() {
      console.log('[DevicesController][index] this: ', this);
      console.log('[DevicesController][index] Coordinator: ', Coordinator);


        this.data = {
            bluetooth: {
                state: 'Faked OK',
                availability: 'Faked Available'
                devices: '[aked Device 1]              <= The closing ' are missing here, causing a syntax error.
            }
        }

      console.log('[DevicesController][index] returned data: ', this.data);

      return this.data;
    }
```

  This syntax error, stops the loading proccess raising a fatal error.

  Solution: If some like this happens to you, just back your steps and look for a syntax errors, missing parent extends or dependency files.


## License

This project is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this framework for personal or commercial purposes, with proper attribution.

