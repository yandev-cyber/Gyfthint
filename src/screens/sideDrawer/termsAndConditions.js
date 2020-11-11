import React, {Component} from 'react';
import {View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';

import {BackButton} from '../../components';

class TermsAndConditions extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <BackButton
        goBack={() => navigation.navigate(navigation.getParam('activeTab'))}
      />
    ),
  });

  state = {
    isFocused: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      activeTab: this.props.activeTab,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab) {
      this.props.navigation.setParams({
        activeTab: this.props.activeTab,
      });
    }
  }

  render() {
    const html = `
   <!DOCTYPE html>
<html lang="en">
<head>
	<title>Terms And Conditions</title>
	<link href="https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,700i,900,900i&display=swap" rel="stylesheet">
	<style type="text/css">
		body{font-family: 'Rubik', sans-serif;}
		p,ul,li{color: #8E8E8E;}
		strong,h2{color: #000000;}
		h2{font-weight: bold;}
		.containerTerm ul{padding: 0 20px;}
		.Tcenter{text-align: center;}
		.text-red{color:#FE9B9B;}
	</style>
</head>
<body>
<div class="containerTerm">
<h2 class="Tcenter">Gyfthint Terms of Use</h2>
<p>Welcome to the Gyfthint mobile device application. &nbsp;Gyfthint, Inc. (&ldquo;Gyfthint,&rdquo; &ldquo;we,&rdquo; &ldquo;our&rdquo; or &ldquo;us&rdquo;) operates the Gyfthint application (collectively, the &ldquo;Service&rdquo;) subject to the following Terms of Use (&ldquo;Terms&rdquo;). &nbsp;Every time users (&ldquo;Users,&rdquo; &ldquo;you&rdquo; or &ldquo;your&rdquo;) visit, use its features, or shop through the Service, you agree to be bound by these Terms as well as the incorporated Gyfthint Privacy Policy [INCLUDE LINK] (&ldquo;Privacy Policy&rdquo;)<span style="text-decoration: line-through;">. &nbsp;</span>These Terms outline your rights, obligations and restrictions regarding your use of the Service, please read them carefully. If you do not agree to be bound by the Terms and all applicable laws, you should discontinue use of the Service immediately. &nbsp;</p>
<p>Gyfthint may modify the Terms from time to time and each modification will be effective when it is posted on the Service. You agree to be bound to any changes to the Terms through your continued use of the Service.</p>
<p><strong>You must be at least </strong><strong>13</strong><strong>&nbsp;years old to use this Service</strong></p>
<p>Users under the age of 13&nbsp;are prohibited from using this Service. Use of the Service by any user shall be deemed to be a representation that the user is 13&nbsp;years of age or older.</p>
<p><strong><u><strong>Creating an Account, Contributing Content and Making Purchases</strong></u></strong></p>
<p>Once you have downloaded the application to your mobile device, you must register with Gyfthint to create an account (your &ldquo;Account&rdquo;) that you can use to generate your user profile and share your gift wish list (such data, information and content, &ldquo;Your Content&rdquo;). &nbsp;You may also use your Account to view information, data, and content (generally, &ldquo;Content&rdquo;) created by Gyfthint or by other Gyfthint users within your network (such Content, &ldquo;User Generated Content&rdquo;) or provided by third parties (&ldquo;Third Party Content&rdquo;).</p>

<p>Gyfthint does not warrant that product or service descriptions or other User Generated or Third Party Consent of this Service is accurate, complete, reliable, current, or error-free. &nbsp;&nbsp;If you are dissatisfied with the Service, please provide feedback through the provided feedback mechanisms. Your only other remedy (and Gyfthint&rsquo;s sole liability) with respect to any dissatisfaction with the Service, these Terms or the Privacy Policy is to cease using Gyfthint and terminate your Account.</p>

<p><strong>Your Account</strong></p>
<p>To create your Account, you must provide certain basic personal information about yourself, including but not limited to your name, email address and cell phone number. Alternatively, you may register with Gyfthint through your account with certain third party social networking services, including Facebook and Twitter (collectively, "SNS"). When you register through your SNS account, you will be asked to login to the Service using your SNS account credentials. By creating an Account via your account with an SNS, you are allowing Gyfthint to access your SNS account information and you are agreeing to abide by the applicable terms and conditions of your SNS in your use of the Service via such SNS. You have the option to disable the connection between your Gyfthint Account and SNS account at any time by accessing the SNS account and disconnecting access to the Service.</p>

<p>You will also have the option to provide additional personal information such as your shipping address, birthday, and information about what holidays you do or do not celebrate. You are responsible for ensuring that any personal information you provide is accurate and up to date. &nbsp;You are responsible for creating a secure password and protecting your Account from unauthorized access. &nbsp;You agree to notify Gyfthint immediately if you believe your user identification, password or other identifying information has been lost, stolen or otherwise compromised. &nbsp;You will be held responsible for any activity that occurs under your Account. &nbsp;You also acknowledge and agree that you are solely responsible for all damages or claims that may arise from any access to or use of this Service by any person to whom you have provided your user identification, password or other identifying information, or by any person who has obtained such information from you, including, but not limited to, any access to or use of this Service that may occur after you have notified us that your user identification, password or other identifying information has been lost, stolen or otherwise compromised.</p>

<p>You will not impersonate, abuse, harass, threaten or intimidate other people from your Account.</p>

<p><strong>Contributing Content </strong></p>
<p>By contributing Content to Gyfthint, you acknowledge and agree to the following terms and our Privacy Policy. You should only contribute Content if you are comfortable with these terms:</p>
<ul>
<li>Your Content will be visible to all users within your network on the Service.</li>
<li>You will contribute accurate photos and information. Content that is inaccurate, offensive, indecent, inaccurate, objectionable, or otherwise inappropriate may be flagged and removed without notice.</li>
<li>All content posted on the Service must comply with all applicable laws (including, without limitation, U.S. copyright law). You represent and warrant that (i) you own or otherwise possess all rights to use your Content; (ii) You have the permission to use the name and likeness of each identifiable individual person and to use such individual's identifying or personal information; (iii) you are authorized to grant all of the rights described in these Terms; and (iv) the use of your Content as contemplated by these Terms will not infringe or violate any intellectual property, privacy, publicity, contract or other rights of any person or entity. If you do not have the right to submit Content for such use, it may subject you to liability.</li>
<li>You will be held solely responsible and liable for your Content and conduct on the Gyfthint Service. &nbsp;Gyfthint will not be responsible or liable for any use of your Content by Gyfthint in accordance with these Terms. You represent and warrant that you have all the rights, power and authority necessary to grant the rights granted herein to any Content that you submit. &nbsp;</li>
<li>Your Content may be modified or adapted (for example, photos may be cropped) in order to meet design and technical requirements of the Service or for any other reason. &nbsp;You are responsible for retaining original copies of your Content.</li>
</ul>
<p>Your Content always belongs to you. You retain copyright and any other rights you already hold in your Content, but by uploading, posting, contributing, or otherwise providing your Content to Gyfthint, you grant Gyfthint a worldwide, non-exclusive, perpetual, irrevocable, royalty-free, fully paid, sublicensable and transferable license to use, modify, reproduce, distribute, prepare derivative works of, display, perform, and otherwise fully exploit your Content in connection with the Service and Gyfthint&rsquo;s (and its successors&rsquo; and assigns&rsquo;) business, including without limitation for promoting and redistributing part or all of the Services (and derivative works thereof) or the Service in any media formats and through any media channels (including, without limitation, third party services). &nbsp;For clarity, the foregoing license grant does not affect your other ownership or license rights in your Content, including the right to grant additional licenses to the material in your Content, unless otherwise agreed in writing.</p>
<p><strong>Making Purchases</strong></p>

<p>The inclusion of any products or services on a user&rsquo;s Account at a particular time does not imply or warrant that these products or services will be available at any time. By placing an order, you represent that the products ordered are legal to possess and use where your intended recipient intends to possess and use them and will be used only in a lawful manner. All movies, videos, games, apps, and similar products sold, rented, or otherwise distributed or available through the app are for private, home use (where no admission fee is charged), non-public performance and may not be duplicated. &nbsp;In the event of any problem with the products or services that you have purchased or rented from the app, you may seek a return and refund for such product or services in accordance with our return policy posted on the app. &nbsp;</p>

<p>We attempt to ensure that information on the app is complete, accurate and current. Despite our efforts, the information on the app may occasionally be inaccurate, incomplete or out of date. We make no representation as to the completeness, accuracy or currentness of any information on the app. In addition, we may make changes in information about price and availability without notice. The price displayed on the app may differ from the price for the same item sold as in-store merchandise. While it is our practice to confirm orders by email, the receipt of an email order confirmation does not constitute our acceptance of an order or our confirmation of an offer to sell a product or service. We reserve the right, without prior notice, to limit the order quantity on any product or service and/or to refuse service to any customer. We also may require verification of information prior to the acceptance and/or shipment of any order.</p>
<p><br />When an order is placed, it will be shipped&nbsp;<span class="text-red"><u>directly from the applicable vendor to a person</u></span> and at an address designated by the purchaser as long as that shipping address is compliant with the shipping restrictions contained on the app. All purchases from the app are made pursuant to a shipment contract. As a result, risk of loss and title for items purchased from the app pass to you upon delivery of the items to the carrier. You are responsible for filing any claims with carriers for damaged and/or lost shipments.</p>
<p>Be sure to review our Privacy Policy to better understand how your shared and private information is used and protected. &nbsp;</p>
<p><strong>Removal of Your Account and Your Content</strong></p>
<p>You may disable or delete your Account at any time via the Gyfthint app. If you disable your Account, we will use commercially reasonable efforts to stop displaying your shared Content throughout the Service. &nbsp;However, other Gyfthint users may have acted on your Content (for example, buying a gift you posted) prior to such deletion or disabling.</p>
<p>We reserve the right to monitor and review your Account, your Content and your activity for compliance with these Terms, and may remove or disable your Account or Content for any reason, including, but not limited to, violation of Terms, alleged infringement or verbal, physical, written or other abuse of a Gyfthint user, employee, member or officer. We will do our best to communicate with you via your Account email address prior to removal of your Account or your Content, but are not obligated to do so and cannot be responsible for failure to reach you via email. &nbsp;</p>
<p>We cannot guarantee access to your Account or your Content. &nbsp;We have no obligation to retain or provide you with copies of your Content. We reserve the right to reclaim any username created by a Gyfthint user that has been inactive for 6 months or more. Your Account may be permanently disabled due to prolonged inactivity.</p>
<p><strong><u><strong>Guidelines, Rights and Remedies</strong></u></strong></p>
<p><strong>Permitted Use of the Service </strong></p>
<p>Gyfthint allows Users to access and make personal use of this Service on the applicable phone applications as a registered User. &nbsp;Users may not modify the Service, or any portion of it, except with express written consent of Gyfthint.</p>
<p>Gyfthint reserves the right to charge for certain features of the Service. Should you elect to subscribe to such features, you shall pay all applicable fees, as described on the Service, in connection with such features.</p>
<p>You are responsible for any fees charged by your internet service provider or mobile carrier for using the Service, including, but not limited to data transfer fees.</p>
<p>You agree that you will not use or attempt to use this Service for any purpose other than for tracking and reviewing your or your network contacts&rsquo; gift lists, or for otherwise conducting legitimate business with Gyfthint; you may not (and may not allow any third party to) use or attempt to use this Service or upload, download, post, submit or otherwise distribute or facilitate distribution of content on or through the Service for any purpose:</p>
<ul>
<li>that infringes any patent, trademark, trade secret, copyright, right of publicity or other right of any other person or entity,</li>
<li>that is any way unlawful or prohibited, or that is harmful, threatening, abusive, harassing, deceptive, fraudulent, offensive, obscene, profane, or otherwise destructive to anyone or their privacy or property,</li>
<li>that transmits any unauthorized or unsolicited advertisements, solicitations, schemes, spam, flooding, or other unsolicited spam or bulk e-mail (including without limited postings to third party social media services which are linked to the Service) or unsolicited commercial communications,</li>
<li>that transmits any harmful or disabling computer codes, files, programs or viruses,</li>
<li>that harvests e-mail addresses or personally identifiable information from Gyfthint,</li>
<li>that interferes with our network services or the proper working of the Service or activities conducted on the Service,</li>
<li>that uses manual or automated software or other processes to &ldquo;crawl&rdquo;, &ldquo;spider&rdquo;, index or in any non-transitory manner store or cache information obtained from any page of the Service,</li>
<li>that attempts to gain unauthorized access to our Service including bypassing measured we may use to prevent or restrict access to the Service (or other accounts, computer systems or networks connected to the Service),</li>
<li>that suggests an express or implied affiliation with Gyfthint (without the express written permission of Gyfthint) or that impersonates any person or entity including an employee or representative of Gyfthint,</li>
<li>that impairs or limits our ability to operate this Service or any other person&rsquo;s ability to access and use this Service.</li>
</ul>
<p>Gyfthint reserves the right at all times and for any reason or for no reason at all, in its sole discretion and without notice to you, to deny your access to and use of this Service.</p>
<p><strong>Intellectual Property Rights</strong></p>
<p>This Service or any portion of this Service may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without express written consent of Gyfthint. You may not frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of Gyfthint without express written consent. You may not use any meta tags or any other "hidden text" utilizing Gyfthint's name or trademarks without the express written consent of Gyfthint. You may not (directly or indirectly) decipher, decompile, disassemble, reverse engineer or otherwise attempt to derive source code or underlying ideas or algorithms of any part of the Service, or modify, translate or otherwise create derivative works of any part of the Service. &nbsp;Any modification of content, or any portion thereof, or use of the content for any other purpose constitutes an infringement of trademark or other proprietary rights of Gyfthint or third parties, and any unauthorized use terminates the permission to use the Service granted by Gyfthint.</p>
<p>Except for User Generated Content, all content included on this Service, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Gyfthint or its content/software suppliers and protected by United States and international copyright laws. The compilation of all content on this site is the exclusive property of Gyfthint and protected by U.S. and international copyright laws. All software used on this site is the property of Gyfthint or its software suppliers and protected by United States and international copyright laws. &nbsp;</p>
<p><strong>Notice and Take Down Procedures </strong></p>
<p>If you believe any post or information on the Service infringes your copyright or trademark rights, you may request such content be removed by following the notice and take down procedures of the Digital Millennium Copyright Act. To follow those procedures, contact Gyfthint&rsquo;s copyright agent (identified below) and provide the following information:</p>
<ul>
<li>A clear statement identifying the works, or other materials believed to be infringed.</li>
<li>A statement from the copyright holder or authorized representative that the content is believed to be infringing.</li>
<li>Sufficient information about the location of the allegedly infringing content so that Gyfthint can find and verify its existence.</li>
<li>Your name, telephone number and e-mail address.</li>
<li>A statement from you under penalty of perjury that the information supplied is accurate, and that you are authorized to act on the copyright owner's behalf.</li>
<li>A signature or the electronic equivalent from the copyright holder or authorized representative.</li>
</ul>
<p>Gyfthint&rsquo;s agent for notice of copyright issues on the Service can be reached as follows:</p>
<p>Gyfthint, Inc.</p>
<p>ADDRESS</p>
<p>Attn: Copyright Agent </p>
<p>If you are not sure whether material available online infringed your copyright, we suggest that you first contact an attorney.</p>
<p><strong>Counter-Notice</strong></p>
<ul>
<li>If you believe that your removed content (or content to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a counter-notice containing the following information to the Copyright Agent:</li>
<li>Your physical or electronic signature;</li>
<li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled;</li>
<li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content; and</li>
<li>Your name, address, telephone number, and e-mail address, a statement that you consent to the jurisdiction of the state or federal courts of the Commonwealth of Massachusetts, and a statement that you will accept service of process from the person who provided notification of the alleged infringement.</li>
<li>If a counter-notice is received by the Copyright Agent, we may send a copy of the counter-notice to the original complaining party informing that person that we may replace the removed content or cease disabling it in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, member or user, the removed content may be replaced, or access to it restored in 10 business days or more after receipt of the counter-notice, at our sole discretion.</li>
</ul>
<p>Gyfthint&rsquo;s agent for notice of copyright issues on the Service can be reached as follows:</p>
<p>Gyfthint, Inc.</p>
<p>[ADDRESS]</p>
<p>Attn: Copyright Agent </p>
<p><strong><u><strong>General Information</strong></u></strong></p>
<p><strong>Linking to Third Party Websites</strong></p>
<p>For your convenience, the Service may provide links to products or services offered on other websites or applications. Unless expressly stated otherwise, Gyfthint does not endorse, approve, sponsor or control, and we are not in any way responsible for, any of the content, services, calculations, information, products or materials available at or through any websites to which this Service may provide a link. By using the Service you acknowledge and agree that Gyfthint will not be responsible or liable to you or any other person for any damages or claims that might result from your use of such content, services, calculation, information, products or materials. You should carefully review each website&rsquo;s privacy statements and conditions of use to understand your rights and responsibilities.</p>
<p>Prices and availability of products made available by third parties via the Service are subject to change without notice. Errors will be corrected where discovered, and Gyfthint reserves the right to revoke any stated offer and to correct any errors, inaccuracies or omissions including after an order has been submitted and whether or not the order has been confirmed and your credit card charged.</p>
<p><strong>Indemnification</strong></p>
<p>You agree to indemnify and hold Gyfthint, its parent, subsidiaries, affiliates, directors, officers, agents, and other partners and employees, harmless from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, including but not limited to reasonable attorneys&rsquo; fees, made by any third party due to or arising out of your Content, Account, use of the Service, or violation of the Terms. This defense and indemnification obligation will survive these Terms and your use of the Service.</p>
<p><strong>Disclaimer &amp; Limitation of Liability</strong></p>
<p>THE SERVICE IS PROVIDED BY GYFTHINT ON AN "AS IS" AND "AS AVAILABLE" BASIS. GYFTHINT MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, IMPLIED WARRANTIES OF MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE, AS TO (1) THE OPERATION OF THE SERVICE, (2) THE QUALITY, ACCURACY, COMPLETENESS OR VALIDITY OF ANY CONTENT ON THE SERVICE, OR THE INFORMATION, CONTENT, OR PRODUCTS INCLUDED ON THE SERVICE, OR (3) WHETHER THE FUNCTIONS CONTAINED ON THE SERVICE WILL BE UNINTERRUPTED OR ERROR FREE, OR THAT DEFECTS WILL BE CORRECTED, INCLUDING BUT NOT LIMITED TO, WARRANTIES OF TITLE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.</p>
<p>YOU AGREE THAT UNDER NO CIRCUMSTANCES WILL GYFTHINT BE LIABLE TO YOU OR ANY OTHER PERSON OR ENTITY FOR ANY SPECIAL, INCIDENTAL, CONSEQUENTIAL, PUNITIVE OR OTHER INDIRECT DAMAGES THAT RESULT FROM THE USE OF, OR THE INABILITY TO USE, THE SERVICE OR THE INFORMATION CONTAINED ON THE SERVICE, EVEN IF PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL THE TOTAL LIABILITY OF GYFTHINT TO YOU FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION RESULTING FROM YOUR USE OF THE SITE, WHETHER IN CONTRACT, TORT (INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE) OR OTHERWISE, EXCEED ONE DOLLAR (US $1.00).</p>
<p>CERTAIN STATE LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MAY NOT APPLY, AND YOU MIGHT HAVE ADDITIONAL RIGHTS.</p>
<p>While we strive to protect your information in accordance with our Privacy Policy, Gyfthint can not be liable for the privacy of information or Content stored on Gyfthint&rsquo;s equipment, transmitted over networks accessed by the Service, or otherwise connected with your use of the Service.</p>
<p><strong>Termination</strong></p>
<p>Gyfthint may, in its sole discretion, terminate or suspend your access to all or part of the Service, for any reason, including without limitation, your breach of these Terms. In the event these Terms are terminated, the restrictions regarding content appearing on the Service, and the representations and warranties, indemnities, and limitations of liabilities set forth in these Terms will survive termination. In the event that you are unsatisfied with the services provided by Gyfthint, your sole remedy is to terminate your use of the Service.</p>
<p><strong>Jurisdiction &amp; Severability</strong></p>
<p>Gyfthint operates the Service from its offices within the United States. Gyfthint makes no representations that content and materials on the Service are legal or appropriate for use from outside the United States. If you choose to access the Service from other locations, you do so at your own risk and are responsible for compliance with any and all local laws. You may not use the Service in violation of U.S. export laws and regulations.</p>
<p>These Terms will be governed by and construed in accordance with the laws of the Commonwealth of Massachusetts. Any action brought to enforce these Terms or matters related to the Service will be brought in either the State or Federal Courts of the Commonwealth of Massachusetts. Any claim or cause of action you have with respect to use of the Service must be commenced within one (1) year after the claim arises.</p>
<p>If any provision of these Terms is deemed void, unlawful, or otherwise unenforceable for any reason, that provision will be severed from these Terms and the remaining provisions of these Terms will remain in force. These Terms constitute the entire agreement between you and Gyfthint concerning your use of the Service.</p>
<p><strong>How To Contact Us</strong></p>
<p>Should you have any questions or complaints regarding violations of these Terms, please contact us at [EMAIL].</p>
<p><strong>Last Updated</strong>: March&nbsp;2, 2017</p>
</div>
</body>
</html>
    `;
    return (
      <View style={{flex: 1}}>
        <NavigationEvents
          onWillBlur={() => {
            this.setState({isFocused: false});
          }}
          onDidFocus={() => {
            this.setState({isFocused: true});
          }}
        />

        {this.state.isFocused && (
          <WebView
            source={{html}}
            useWebKit={true}
            style={{marginHorizontal: wp('5%')}}
          />
        )}
      </View>
    );
  }
}

// Mapping redux state to props
const mapStateToProps = state => ({
  activeTab: state.common.activeTab,
});

export default connect(mapStateToProps, null)(TermsAndConditions);
