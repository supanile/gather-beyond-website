# Credit Field Implementation

## Overview
Added a new `credit` field to the user system and updated the application to use `credit` instead of `total_points` for better semantic clarity.

## Changes Made

### 1. API Updates

#### `/app/api/users/route.ts`
- Modified to include `credit` field in user data
- Uses `total_points` as fallback for backward compatibility
- Returns: `credit: user.credit || user.total_points || 0`

#### `/app/api/users/[userId]/route.ts` (New)
- New endpoint to fetch individual user data with credit field
- Includes username from Discord_name table
- Returns complete user profile with credit information

#### `/app/api/users/[userId]/credit/route.ts` (New)
- **GET**: Fetch user's current credit balance
- **PUT**: Update user's credit with support for operations:
  - `set`: Set credit to specific value
  - `add`: Add to current credit
  - `subtract`: Subtract from current credit (minimum 0)

### 2. Type Definitions

#### `/types/admin/userManagement.ts`
- Added `credit: number` field to User interface
- Kept `total_points` for backward compatibility

#### `/types/admin/adminTypes.ts`
- Added `credit: number` field to User interface
- Kept `total_points` for backward compatibility

#### `/types/admin/userTableTypes.ts`
- Added `credits: number` field to UserAgent interface

### 3. Component Updates

#### `/components/admin/user-overview/UserProfileHeader.tsx`
- Updated to display credit instead of total_points
- Uses fallback: `user.credit || user.total_points || 0`
- Maintains backward compatibility

### 4. Utility Updates

#### `/lib/admin/adminUtils.ts`
- Updated `calculateStats` function to use credit field
- Uses fallback: `user.credit || user.total_points || 0`

## API Usage Examples

### Get User Credit
```bash
GET /api/users/[userId]/credit
```

Response:
```json
{
  "discord_id": "421249349469732874",
  "credit": 150,
  "total_points": 100,
  "last_updated": "2025-10-03T10:30:00.000Z"
}
```

### Update User Credit
```bash
PUT /api/users/[userId]/credit
Content-Type: application/json

{
  "credit": 50,
  "operation": "add"
}
```

Response:
```json
{
  "discord_id": "421249349469732874",
  "credit": 200,
  "previous_credit": 150,
  "operation": "add",
  "change": 50,
  "updated_at": "2025-10-03T10:35:00.000Z"
}
```

## Backward Compatibility

The implementation maintains full backward compatibility:
- Existing `total_points` field is preserved
- Components fallback to `total_points` if `credit` is not available
- API responses include both fields during transition period

## Migration Strategy

1. **Phase 1**: Deploy with both fields supported (current implementation)
2. **Phase 2**: Update database to populate `credit` field for all users
3. **Phase 3**: Gradually migrate all references to use `credit`
4. **Phase 4**: Eventually deprecate `total_points` field (future consideration)

## Files Modified

- `app/api/users/route.ts`
- `app/api/users/[userId]/route.ts` (new)
- `app/api/users/[userId]/credit/route.ts` (new)
- `components/admin/user-overview/UserProfileHeader.tsx`
- `types/admin/userManagement.ts`
- `types/admin/adminTypes.ts`
- `types/admin/userTableTypes.ts`
- `lib/admin/adminUtils.ts`

## Testing

Test the new credit functionality:

1. **Get all users**: `GET /api/users`
2. **Get specific user**: `GET /api/users/[userId]`
3. **Get user credit**: `GET /api/users/[userId]/credit`
4. **Update user credit**: `PUT /api/users/[userId]/credit`

All endpoints should return the credit field properly and maintain backward compatibility with total_points.
