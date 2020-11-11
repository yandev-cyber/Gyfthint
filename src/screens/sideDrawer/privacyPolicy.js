import React, {Component} from 'react';
import {View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';

import BackButton from '../../components/backButton';

class PrivacyPolicy extends Component {
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
	<title>Privacy Policy</title>
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
	<h2 class="Tcenter">Gyfthint, Inc. Privacy Policy</h2>
	<p>Gyfthint, Inc. (&ldquo;Gyfthint&rdquo;), the company that operates the Gyfthint mobile application (&ldquo;Service&rdquo;), is committed to protecting your privacy while providing you with a robust gift giving and receiving experience. &nbsp;This Privacy Policy describes:</p>
	<ul>
	<li>Why we collect personal information</li>
	<li>What personal information we collect and when it is collected</li>
	<li>How your information is used and protected</li>
	<li>When and with whom your information is shared</li>
	<li>Your choices regarding your personal information</li>
	</ul>
	<p>We will post notices of all changes that materially affect the way in which your personally identifiable information may be used or shared in updates to our Privacy Policy. This policy does not apply to the practices of companies that Gyfthint does not own or control (including any third-party products or services used for logging into the Service or that are integrated with the Service), or to individuals that Gyfthint does not employ or manage. &nbsp;If you have any questions about this Privacy Policy, please feel free to contact us through our Service or write to us at:</p>
	<p>Gyfthint, Inc.</p>
	<p>[ADDRESS]<br />[EMAIL ADDRESS]</p>
	<p>Attn: Customer Service/Privacy</p>
	<p><strong><u><strong>Information We Collect</strong></u></strong></p>
	<p>The information we learn from users helps us not only provide the Service but also to personalize and continually improve each user&rsquo;s experience with the Service. &nbsp;Here are the types of information we gather:</p>
	<p><strong>Information You Give Us</strong></p>
	<p>When you create an Account with Gyfthint, we may ask you for personally identifiable information. This refers to information about you that can be used to contact or identify you ("Personal Information"). Personal Information includes, but is not limited to, your name, username, phone number, credit card and other billing information, email address, shipping address, and your friends&rsquo; cell phone numbers and email addresses (which we will only use to invite them to use the Service). We may also collect profile information you supply to us regarding your personal preferences and interests, such as your gender, birthday, certain anniversaries or milestones and whether you celebrate certain holidays. You can choose not to provide us with any or all of the information we specify or request, but then you may not be able to register with us or to take advantage of some or all of our features. You can register by logging into your account with certain third party social networking sites ("SNS") (including Facebook and Twitter) via our Service. If you decide to create your Account by logging into a SNS via the Service, we may extract the Personal Information you have provided to the SNS (such as your "real" name, email address and other information you make publicly available via the SNS) from the account you have with such SNS and use that information to create your Account; the information we extract may depend on the privacy settings you have with the SNS.</p>
	<p>Once you&rsquo;ve created an Account, you can choose to select individual photos of items you would like to add to your shared wishlist (such items, &ldquo;Gyfthints&rdquo;) to upload, tag with information including the location where the photo was taken and the Gyfthint&rsquo;s listed price, and share on Gyfthint per our Terms of Service. When you upload a photo, any associated metadata your camera might have embedded into that photo, such as the date taken or place taken, may be uploaded as well. &nbsp;You will also provide us with as much detail as you can about each Gyfthint, such as brand and store location, which information is used by us solely to help us provide the Service and is not shared with your contacts. &nbsp;Your contacts will only see the price and photo of each Gyfthint.</p>
	<p><strong>Automatic Information</strong></p>
	<p>Like many other applications, we also collect information through cookies and other automated means. Information of this sort includes:</p>
	<p><em><em>Technical information about your browser and mobile device:</em></em>&nbsp;This information is used in the aggregate to help us optimize the Service for common browsers and devices.</p>
	<p><em><em>Usage information, such as the pages you request, searches you conduct and the features and emails from Gyfthint that you interact with:</em></em>&nbsp;This information is used in an aggregate form to generate statistics about how the Service is being used and to target communications but is never shared in any form that could be reasonably used to identify you personally.</p>
	<p><em><em>IP address, cookies, tokens and device identifiers:</em></em>&nbsp;These are alphanumeric identifiers that help us to distinguish between unique browsers and devices in order to avoid showing you the same information twice, keep you logged into Gyfthint, prevent duplicate actions, prevent duplicate coupon redemptions and improve your experience. &nbsp;The information we collect from cookies may include your IP address, browser and device characteristics, referring URLs, and a record of your interactions with our Service. You are always free to decline our cookies if your browser permits, but some parts of our Service may not work properly for you if you do so. We will not allow third parties to place cookies on our Service.</p>
	<p><em><em>Crashes and error reports: </em></em>If you encounter a crash or error while using our Service, we may generate a crash report that includes technical, usage and, if you are logged in, your Account information so that we can diagnose and potentially prevent the problem in the future.</p>
	<p><strong>Third Party Information</strong></p>
	<p>We may receive information from third parties such as public demographic information to help analyze the use of our services and expand our offering.</p>
	<p><strong>User Content</strong></p>
	<p>Any profile information you post on this Service may be read, collected, and used by us and others who access this Service. &nbsp;You should only upload profile information if you are comfortable with these terms. &nbsp;</p>
	<p><strong><u><strong>How We Use and Share the Information We Collect</strong></u></strong></p>
	<p><strong>Use</strong><strong><br /></strong><strong><br /></strong>We use the information we collect for things like:</p>
	<ul>
	<li>Providing the Service and communicating with you</li>
	<li>Conducting research and analysis</li>
	<li>Establishing and managing your Account with us and tailoring information and offers to you based on your interactions with our Service</li>
	<li>Operating, evaluating and improving our business</li>
	</ul>
	<p><strong>Data Retention</strong><strong><br /></strong><br />We will retain your information for as long as your account is active or as needed to provide you services, comply with our legal obligations, resolve disputes, and enforce our agreements.</p>
	<p><strong>Share</strong><strong><br /></strong><strong><br /></strong>Gyfthint does not sell, rent or trade your Personal Information to third parties except as necessary to perform the Service or unless it is shared profile information, as described above. In the normal course of business Gyfthint shares Personal Information with individuals (such as employees, contractors and lawyers) and companies (such as consultants and service providers such as a push notification delivery service) to perform tasks on our behalf and may need to share certain information with them in order to provide products or services to you. However, our agents do not have any right to use Personal Information we share with them beyond what is necessary to assist us in providing the service to you as described in this Privacy Policy. &nbsp;For example, we may share your <span class="text-red"><u>name and</u></span> shipping information with the vendors from <span class="text-red"><u>whom</u></span> we are purchasing a gift on your or your contact&rsquo; behalf, to enable the vendor to&nbsp;<span class="text-red"><u>identify you</u> and&nbsp;ship the purchased gifts. &nbsp;<span class="text-red"><u>While we encourage vendors to treat your personal information with the same level of care as we do, we cannot be responsible for the use by such vendors of your personal information.</u></span> &nbsp;We also transfer your financial information (such as valid credit card number, type, expiration date or other financial information) directly to our third party payment processing company, whose terms of service and privacy policy shall govern treatment of such information.</p>
	<p>While we may provide aggregate usage and demographic information to service partners to help improve the service, we never provide your Personal Information to partners directly except as <span class="text-red"><u>described above</u></span> to fulfill a purchase on the Service, nor do we <span class="text-red"><u>otherwise</u></span> disclose aggregate information to&nbsp;partners&nbsp;in a manner that would identify you personally. We encourage our service partners to adopt and post privacy policies as well. However, the use of this aggregate information by our service partners, as well as any Personal Information you directly provide to partners or advertisers, is governed by the privacy policies of those service partners and is not subject to our control.</p>
	<p>Sometimes we may be required to share personal information in response to a regulation, court order or subpoena. We may also share information when we believe it's necessary to comply with the law. We also may share information to respond to a government request or when we believe disclosure is necessary or appropriate to protect the rights, property or safety of Gyfthint, our customers, or others; to prevent harm or loss; or in connection with an investigation of suspected or actual unlawful activity.</p>
	<p>We may also share personal information in the event of a corporate sale, merger, acquisition, dissolution or similar event.</p>
	<h2><strong><u><strong>How We Protect the Information We Collect</strong></u></strong></h2>
	<p>Gyfthint uses reasonable security measures to protect the confidentiality of personal information under our control and appropriately limit access to it. We cannot ensure or warrant the security of any information you transmit to us and you do so at your own risk.</p>
	<p>We use a variety of information security measures to protect your online transactions with us. The Service uses encryption technology, such as Secure Sockets Layer (SSL), to protect your personal information during data transport. SSL protects information you submit via our Service such as ordering information including your name, address and credit card number. We will notify you by email if we have reason to believe that your Personal Information has been compromised due to a security breach or used in an unauthorized manner, but by using this Service, you agree to release us from any and all claims arising out of unauthorized use of your information.</p>
	<h2><strong><u><strong>Your Choices Regarding the Information We Collect</strong></u></strong></h2>
	<p>You may choose to:</p>
	<ul>
	<li>Stop receiving marketing or promotional e-mails, direct mail, or other marketing communications</li>
	<li>Update and correct your personal information</li>
	<li>Cancel your account or request that we no longer use your information to provide you services</li>
	<li>Control when and whether content posted to third party services, such as Facebook or Twitter, using both settings provided by Gyfthint and settings provided by the third party service</li>
	<li>Request removal of your personal information from our Service</li>
	</ul>
	<p>&nbsp;To do any of these, simply notify us of this decision by one of these methods:</p>
	<ul>
	<li>Follow the unsubscribe link in any marketing email or follow the directions included in any other promotional material received from Gyfthint</li>
	<li>Send an email to us at [EMAIL]</li>
	<li>Write to us at:</li>
	</ul>
	<p>Gyfthint, Inc.</p>
	<p>[ADDRESS]</p>
	<p>Attn: Customer Service/Privacy</p>
	<p>Please note that any opt&ndash;out request sent via postal mail may take at least sixty (60) days to become effective.</p>
	<h2><strong>Third Party Services and Links to Other Websites </strong></h2>
	<p>Our app may contain links to other websites, many of which have their own privacy policies. Be sure to review the privacy policy on the site you're visiting.</p>
	<p>Additionally, we may integrate third party services in to our Service in order to personalize your experience. &nbsp;This policy only covers the use of cookies by Gyfthint. &nbsp;Cookies placed by third party services are governed by the third party terms and privacy policies applicable to those services (which we encourage you to read).</p>
	<p><strong>Children&rsquo;s Privacy</strong><br />We restrict use of the website to individuals age 13&nbsp;and above, and do not knowingly seek or collect personal information from anyone under the age of 13.&nbsp;<span class="text-red"><u>If we discover that a child under 13 has provided us with personal information, we will immediately delete such information from our systems.</u></span></p>
	<p><strong>Changes to this Privacy Policy</strong></p>
	<p>Please note that this Privacy Policy may change from time to time. We will post any Privacy Policy changes on this page and, if the changes are significant or involve changes to the way we use Personal Information, we will notify you by delivering an announcement via our Service or your Account email. &nbsp;If you opt out of communications from Gyfthint, you may not receive these notifications, however they will still govern your use of the Service, and you are responsible for proactively checking for any changes. Each version of this Privacy Policy will be identified by its effective date found at the bottom of this page.</p>
	<p>If you have any additional questions or concerns about this Privacy Policy, please feel free to contact us any time through this Service, email us at &nbsp;[EMAIL] or write to us at:</p>
	<p>Gyfthint, Inc.</p>
	<p>[ADDRESS]</p>
	<p>Attn: Customer Service/Privacy</p>
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

export default connect(mapStateToProps, null)(PrivacyPolicy);
