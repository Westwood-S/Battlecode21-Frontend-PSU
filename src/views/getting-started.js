import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Floater from 'react-floater';

class GettingStarted extends Component {
  constructor() {
    super();

    this.state = {
        ide: "intellij"
    }

  }

  terminalButton = () => {
      this.setState({ide: "terminal"})
  }
  intellijButton = () => {
      this.setState({ide: "intellij"})
  }
  eclipseButton = () => {
      this.setState({ide: "eclipse"})
  }

  getSelectionButtons(ide) {
      var l = "btn btn-secondary ide-button-getting-started"
      if (ide === this.state.ide) {
            l += " selected-ide-button"
      }
      return l;
  }

  getIDEInstallation() {
      if (this.state.ide === 'intellij') {
          return (
                <div>
                    <ul style={{marginLeft: '-15px'}}>
                        <li>Install IntelliJ IDEA Community Edition <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://www.jetbrains.com/idea/download/'>from here</a>.</li>

                        <li>In the <code>Welcome to IntelliJ IDEA</code> window that pops up when you start IntelliJ, select <code>Open</code>. Then select the <code>build.gradle</code> file in the scaffold folder.</li>
                        
                        <li>Hit <code>Open as Project</code>.</li>
                        
                        <li>
                            We need to set the jdk properly; open the settings with <code>File &gt; Settings</code> (<code>IntelliJ IDEA &gt; Preferences</code> on Mac)
                            or <code>ctrl+alt+s</code>. Navigate to <code>Build, Execution, Deployment &gt; Build Tools &gt; Gradle</code> and change <code>Gradle JVM</code> to 1.8
                        </li>
                        
                        <li>
                            Time for a first build! On the right side of the screen, click the small button that says gradle and has a picture of an elephant. Navigate to
                            <code>battlecode21-scaffold &gt; Tasks &gt; battlecode</code> and double click on <code>update</code> and then <code>build</code>. This will run tests
                            to verify that everything is working correctly, as well as download the client and engine for you.
                        </li>

                        <li>If you haven't seen any errors, you should be good to go.</li>
                    </ul>
                </div>)
      } else if (this.state.ide === 'eclipse') {
          return (
                <div>
                    <ul style={{marginLeft: '-15px'}}>
                        <li>Download the latest version of Eclipse <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://www.eclipse.org/downloads/'>from here</a>.</li>

                        <li>In the Installer, select <code>Eclipse IDE for Java Developers</code>.</li>

                        <li>Create a new Eclipse workspace. The workspace should NOT contain the <code>battlecode21-scaffold</code> folder.</li>
                        <li>
                            Run <code>File -&gt; Import...</code>, and select <code>Gradle / Existing Gradle Project</code>.
                            <Floater content={
                                <div><p>
                                    If you are unable to find this option, you may be using an old version of Eclipse.
                                    If updating your Eclipse version still does not work, you may need to manually install
                                    the "Buildship" plugin from the Eclipse marketplace.
                                </p></div>
                                } showCloseButton={true}>
                                <i className="pe-7s-info pe-fw" />
                            </Floater>
                        </li>
                        <li>Next to <code>Project root directory</code> field, press <code>Browse...</code> and navigate to <code>battlecode21-scaffold</code>. Finish importing the project.</li>
                        <li>If you do not see a window labeled <code>Gradle Tasks</code>, navigate to <code>Window / Show View / Other...</code>. Select <code>Gradle / Gradle Tasks</code>.</li>
                        <li>
                            In the <code>Gradle Tasks</code> window, you should now see a list of available Gradle tasks. Open the <code>battlecode21-scaffold</code> folder and navigate to the
                            <code>battlecode</code> group, and then double-click <code>update</code> and <code>build</code>. This will run tests to verify that everything is working correctly,
                            as well as download the client and engine for you.
                        </li>
                        <li>
                            You're good to go; you can run other Gradle tasks using the other options in the <code>Gradle Tasks</code> menu.
                            Note that you shouldn't need any task not in the <code>battlecode</code> group.
                            <Floater content={
                                <div><p>
                                    If you rename or add jar files to the lib directory, Eclipse gets confused. You'll need to re-add them using <code>Project / Properties / Java Build Path</code>.
                                </p></div>
                                } showCloseButton={true}>
                                <i className="pe-7s-info pe-fw" />
                            </Floater>
                        </li>
                    </ul>
                </div>)
      } else if (this.state.ide === 'terminal') {
          return (
                <div>
                    <ul style={{marginLeft: '-15px'}}>
                        <li>Start every Gradle command with <code>./gradlew</code>, if using Mac or Linux, or <code>gradlew</code>, if using Windows.</li>

                        <li>
                            You will need to set the <code>JAVA_HOME</code> environment variable to point to the installation path of your JDK. 
                            On Mac, <code>JAVA_HOME</code> should probably be something like <code>/Library/Java/JavaVirtualMachines/jdk1.8.0_111.jdk/Contents/Home</code>.
                            On windows, it will likely be <code>C:\Program Files\Java\jdk1.8.0_271</code>.           
                        </li>

                        <li>
                            Navigate to the root directory of your <code>battlecode21-scaffold</code>, and run <code>./gradlew update</code> and then <code>./gradlew build</code>
                            (or <code>gradlew build</code> on Windows). This will run tests to verify that everything is working correctly, as well as download the client
                            and engine for you.
                        </li>

                        <li>
                            You're good to go. Run <code>./gradlew -q tasks</code> (<code>gradlew -q tasks</code> on Windows) to see the other Gradle tasks available.
                            You shouldn't need to use any tasks outside of the <code>battlecode</code> group.
                        </li>
                    </ul>
                </div>)
      }
  }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Overview</h4>
                                </div>
                                <div className="content">
                                    <p>
                                        This is the Battlecode 2021 contest website, which will be your main hub for all Battlecode-related things
                                        for the duration of the contest. For a general overview of what Battlecode is, visit <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://battlecode.org'>
                                            here</a>.

                                    </p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Account and Team Creation</h4>
                                </div>
                                <div className="content">
                                    <p>
                                        To participate in Battlecode, you need an account and a team. Each team can consist of 1 to 4 people.
                                    </p>
                                    <p>
                                        Create an account on this website, and then go to the <NavLink to='team' style={{fontWeight:700}}>team</NavLink> section to either create
                                        or join a team.
                                    </p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Installation</h4>
                                </div>
                                <div className="content">
                                    <p>
                                        If you experience problems with the instructions below, check <NavLink to='common-issues' style={{fontWeight:700}}>common issues</NavLink>, and if that doesn't help, ask questions in the class slack channel.
                                    </p> <h6 class="installation-steps">Step 1: Install Java</h6>
                                    <p>
                                        You'll need a Java Development Kit (JDK) version 8. Unfortunately, higher versions will not
                                        work. <a target="_blank" rel="noopener noreferrer" href="http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html" style={{fontWeight:700}}>Download it here</a>.
                                        You may need to create an Oracle account.

                                        <Floater content={
                                            <div><p>
                                                Alternatively, you can install a JDK yourself using your favorite package manager. Make sure it's an Oracle JDK — we don't support anything else — and is compatible with Java 8.
                                            </p></div>
                                            } showCloseButton={true}>
                                            <i className="pe-7s-info pe-fw" />
                                        </Floater>
                                    </p>
                                    <p>
                                        If you're unsure how to install the JDK, you can find instructions for all operating
                                        systems <a target="_blank" rel="noopener noreferrer" href='https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html' style={{fontWeight:700}}>here</a> (pay attention to <code>PATH</code> and <code>CLASSPATH</code>).
                                    </p>
                                    <h6 class="installation-steps">Step 2: Download Battlecode</h6>
                                    <p>
                                        Next, you should download the <b><a target="_blank" rel="noopener noreferrer" href="https://github.com/battlecode/battlecode21-scaffold" style={{fontWeight:700}}>Battlecode 2021 scaffold</a></b>.</p><p>
                                        We recommend that you instead use Git to organize your code. If you haven't used Git before,
                                        read <b><a target="_blank" rel="noopener noreferrer" href='https://guides.github.com/introduction/git-handbook/' style={{fontWeight:700}}>this guide</a></b>.
                                        On the <b><a target="_blank" rel="noopener noreferrer" href="https://github.com/battlecode/battlecode21-scaffold" style={{fontWeight:700}}>scaffold page</a></b>, click "Use this template."
                                        Importantly, on the next page, make your new repo <b>private</b> (you don't want other teams to steal your code!).
                                        You can then clone your newly created repo and invite your team members to collaborate on it.
                                    </p>
                                    <h6 class="installation-steps">Step 3: Local Setup</h6>
                                    <p>
                                        We recommend using an IDE like IntelliJ IDEA or Eclipse to work on Battlecode, but you can also use your favorite text editor combined with a terminal.
                                        Battlecode 2020 uses Gradle to run tasks like <code>run</code>, <code>debug</code> and <code>jarForUpload</code> (but don't worry about that — you don't need to install it).
                                    </p>
                                    <p>
                                        View instructions for: 

                                        <div class="btn-group" role="group" style={{marginLeft: '10px'}}>
                                        <button type="button" class={this.getSelectionButtons('intellij')} onClick={this.intellijButton}>IntelliJ IDEA</button>
                                        <button type="button" class={this.getSelectionButtons('eclipse')} onClick={this.eclipseButton}>Eclipse</button>
                                        <button type="button" class={this.getSelectionButtons('terminal')} onClick = {this.terminalButton}>Terminal</button>
                                        </div>
                                    </p>
                                    <p>
                                        {this.getIDEInstallation()}
                                    </p>
                                    <p>
                                        There should now be a folder called <code>client</code> in your scaffold folder; if you go in there, and double click the
                                        <code>Battlecode Client</code> application, you should be able to run and watch matches. (Please don't move that application,
                                        it will be sad.) If you're on Linux, navigate to the <code>client</code> folder and run <code>./battlecode-visualizer</code>
                                        to launch the client.
                                    </p>



                                    <h6 class="installation-steps">Developing your Bot 🤖</h6>
                                    <p>
                                        Place each version of your robot in a new subfolder in the <code>src</code> folder. Each subfolder inside <code>src</code> folder corresponds to one distinct player. Make sure every version(subfolder) has a <code>RobotPlayer.java</code> which implements a <code>run(RobotController rc)</code> method.
										</p><p>We have provided <code>examplefuncsplayer</code>, and you can create your own player by either modifying it or copying and renaming it.
                                    </p>

                                    <h6 class="installation-steps">Running Battlecode from the terminal or IDE</h6>
                                    <p>
                                        Make sure your <code>JAVA_HOME</code> is set correctly, use <a target="_blank" rel="noopener noreferrer" href='https://www.baeldung.com/find-java-home' style={{fontWeight:700}}>this guide</a>. You can run games directly from the terminal with the gradle task <code>./gradlew run -Pmaps=[map] -PteamA=[Team A] -PteamB=[Team B]</code>. If you
                                        don't include the map or team flags, Battlecode will default to whatever is listed in <code>gradle.properties</code>.
                                        Running the same gradle task from you IDE will also work. </p><p>This produces a replay file in the <code>matches</code> directory of the scaffold, which you can upload to the client to view. If you meet with any problems, visit <NavLink to='common-issues' style={{fontWeight:700}}>Common Issues</NavLink>.
                                    </p>

									<h6 class="installation-steps">Running Battlecode from the Client</h6>
                                    <p>
                                        Open the client as described in Step 3. Navigate to the runner tab,
                                        select which bots and maps to run, and hit Run Game!
                                        Finally, click the play/pause button to view the replay.</p>
									<p> If the runner tab won't work, you can go to the Queue tab, and upload the replay file created in the previous step.
                                    </p>

									<h6 class="installation-steps">Upload Your Bot and Scrimmage</h6>
                                    <p>
                                        Create a zip file containing only your robot code (only one robot each time), and uploaded it to the submissions page. (You can only access that page after you created or joined a team.)
										{/* TODO: cant access the page before in a team */}
                                </p>
                                <p>
                                    Your bot will automatically be ran against other players to determine your ranking.
                                    </p>
									<h6 class="installation-steps">Good Luck! 🍀</h6>
									<p>
                                    Now, read the <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://2021.battlecode.org/specs/specs.md.html'>game specs</a> carefully and consult the <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='https://2021.battlecode.org/javadoc/index.html'>javadocs</a> to learn about the API.
                                </p>
                                <p>
                                    Read about our <NavLink style={{fontWeight:700}} to='debugging'>debugging tools here</NavLink>.
                                </p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="header">
                                    <h4 className="title">Client Tips</h4>
                                </div>
                                <div className="content">
                                    <p>
                                    If you're experiencing memory problems with the client, please try:
                                    </p>
                                    <ul style={{marginLeft: '-15px'}}>
                                        <li>Making fewer logs and/or disabling log processsing in the client (toggled with "L").</li>
                                        <li>Making .bc21 files with the engine directly and uploading them to the client's match queue, rather than using the client's runner. With this method, you can just use the web version at <a style={{fontWeight:700}} target="_blank" rel="noopener noreferrer" href='http://2021.battlecode.org/visualizer.html'>visualizer</a> rather than the desktop application. </li>
                                        </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GettingStarted;
