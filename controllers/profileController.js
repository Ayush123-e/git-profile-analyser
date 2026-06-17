const githubService = require('../services/githubService');
const { Profile } = require('../models');

exports.analyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username parameter is required.'
      });
    }

    const { profile: parsedProfile, analysis } = await githubService.performProfileAnalysis(username);

    let profile = await Profile.findOne({ where: { username: parsedProfile.username } });

    if (profile) {
      await profile.update({
        name: parsedProfile.name,
        avatarUrl: parsedProfile.avatarUrl,
        bio: parsedProfile.bio,
        publicRepos: parsedProfile.publicRepos,
        followers: parsedProfile.followers,
        following: parsedProfile.following,
        analysisData: analysis
      });
    } else {
      profile = await Profile.create({
        username: parsedProfile.username,
        name: parsedProfile.name,
        avatarUrl: parsedProfile.avatarUrl,
        bio: parsedProfile.bio,
        publicRepos: parsedProfile.publicRepos,
        followers: parsedProfile.followers,
        following: parsedProfile.following,
        githubCreatedAt: parsedProfile.githubCreatedAt,
        analysisData: analysis
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile analysis computed and database synchronized.',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.findAll({
      attributes: ['username', 'followers', 'publicRepos'],
      order: [['analyzed_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfileByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username parameter is required.'
      });
    }

    const profile = await Profile.findOne({ where: { username } });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: `Profile for username '${username}' not found in database. Run POST /api/analyze/${username} to analyze and save it first.`
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const deletedCount = await Profile.destroy({ where: { username } });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Profile for username '${username}' not found in database.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Profile for username '${username}' successfully deleted from cache.`
    });
  } catch (error) {
    next(error);
  }
};
