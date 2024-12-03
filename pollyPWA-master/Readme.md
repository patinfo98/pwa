# project plan

## continious delivery workflow
- feature branches
-- pull requests with one approval
- documentation
- build automation
- test automation 
- continious deployment
- security 
-- (no upload of passwords/keys)
-- https

## division of tasks
- testing: 
    -- frontend tests (Selenium): Patrick
    -- backend tests (Jest): Dominik
- build automation (Github Actions): Susanne
- test automation: Dana
- server: Stefan

# Service Worker Testcases

1. Service Worker Registration
   [ ] Verify that the Service Worker registers successfully.

2. Service Worker Activation
   [ ] Check that the Service Worker activates correctly after registration.

3. Caching Resources
   [ ]Ensure that the Service Worker caches resources when the network is available.

4. Serving Cached Resources
   [ ] Validate that the Service Worker serves cached resources when offline.

5. Fetch Event Handling
   [ ]Test that the Service Worker intercepts network requests and serves cached responses.

6. Fallback Mechanism
   [ ] Check the fallback mechanism when a resource is not available in the cache.

7. Updating the Service Worker
   [ ] Verify that the Service Worker updates correctly when a new version is available.

8. Offline Functionality
   [ ] Test the application's behavior when the network is disconnected.

9. Error Handling
   [ ] Simulate network errors and ensure the Service Worker handles them gracefully.

10. Push Notifications (if applicable)
    [ ] Verify that the Service Worker can handle push notifications.

11. Performance Metrics
    [ ] Measure the performance impact of the Service Worker on page load times.