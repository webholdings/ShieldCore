import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function deployToGitHub() {
  try {
    console.log('🚀 Starting GitHub deployment...\n');

    // Get GitHub client
    const octokit = await getUncachableGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login}\n`);

    // Repository details
    const repoName = 'creativewaves';
    const repoDescription = 'CreativeWaves - Multilingual Cognitive Wellness Platform for Senior Adults';

    // Check if repository exists
    let repoExists = false;
    try {
      await octokit.repos.get({
        owner: user.login,
        repo: repoName,
      });
      repoExists = true;
      console.log(`📦 Repository ${user.login}/${repoName} already exists\n`);
    } catch (error: any) {
      if (error.status === 404) {
        console.log(`📦 Creating new repository: ${repoName}...\n`);
        
        // Create repository
        await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description: repoDescription,
          private: false,
          auto_init: false,
        });
        
        console.log(`✅ Repository created: https://github.com/${user.login}/${repoName}\n`);
      } else {
        throw error;
      }
    }

    // Initialize git if not already initialized
    if (!existsSync('.git')) {
      console.log('📝 Initializing Git repository...');
      execSync('git init', { stdio: 'inherit' });
      execSync('git branch -M main', { stdio: 'inherit' });
    }

    // Configure git user if not set
    try {
      execSync('git config user.email', { stdio: 'pipe' });
    } catch {
      console.log('📝 Configuring Git user...');
      execSync(`git config user.email "${user.email || user.login + '@users.noreply.github.com'}"`, { stdio: 'inherit' });
      execSync(`git config user.name "${user.name || user.login}"`, { stdio: 'inherit' });
    }

    // Add remote if not exists
    try {
      execSync('git remote get-url origin', { stdio: 'pipe' });
      console.log('📝 Updating remote origin...');
      execSync(`git remote set-url origin https://github.com/${user.login}/${repoName}.git`, { stdio: 'inherit' });
    } catch {
      console.log('📝 Adding remote origin...');
      execSync(`git remote add origin https://github.com/${user.login}/${repoName}.git`, { stdio: 'inherit' });
    }

    // Stage all files
    console.log('\n📝 Staging files...');
    execSync('git add -A', { stdio: 'inherit' });

    // Commit
    console.log('📝 Creating commit...');
    try {
      execSync('git commit -m "Initial commit: CreativeWaves cognitive wellness platform"', { stdio: 'inherit' });
    } catch (error) {
      console.log('ℹ️  No changes to commit or commit already exists');
    }

    // Push to GitHub
    console.log('\n📤 Pushing to GitHub...');
    const accessToken = await getAccessToken();
    
    // Use token authentication for push
    execSync(`git push https://${accessToken}@github.com/${user.login}/${repoName}.git main --force`, { 
      stdio: 'inherit',
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
    });

    console.log('\n✅ Successfully deployed to GitHub!');
    console.log(`\n🔗 Repository URL: https://github.com/${user.login}/${repoName}`);
    console.log(`📖 View README: https://github.com/${user.login}/${repoName}#readme`);
    
  } catch (error: any) {
    console.error('\n❌ Error deploying to GitHub:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

deployToGitHub();
